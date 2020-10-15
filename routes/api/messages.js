// @author: Luke Bodwell
"use strict";

const express = require("express");

const Message = require("../../models/Message");
const Group = require("../../models/Group");
const User = require("../../models/User");
const githubAuth = require("../auth/github-auth");

const router = express.Router();
const {ensureAuthenticated} = githubAuth;

/*
 * Route: /api/messages/:groupId
 * Method: GET
 * Auth: Required
 * Desc: Gets all messages in the given group. User must belong to the group. Verified by session.
 */
router.get("/:groupId", ensureAuthenticated, (req, res) => {
	// Gather request parameters
	const {groupId} = req.params;
	const {username} = req.user;
	
	try {
		// Find the id of the user with the given username
		const userId = await User.findOne({username})._id;
		// Verify that a group exists with the given id that the current user is a member of
		await Group.find({_id: groupId, members: userId});
		// Find all messages with the given group id sorted by date sent (ascending)
		const messages = await Message.find({groupId}).sort({dateSent: 1});

		// Send result
		res.status(200).res.json({success: true, data: messages});
	} catch (err) {
		// Report errors
		res.status(500).send({success: false, error: err});
	}
});

/*
 * Route: /api/messages/:groupId/:messageId
 * Method: GET
 * Auth: Required
 * Desc: Gets all messages in the given group. User must belong to the group. Verified by session.
 */
router.get("/:groupId", ensureAuthenticated, (req, res) => {
	// Gather request parameters
	const {groupId, messageId} = req.params;
	const {username} = req.user;
	
	try {
		// Find the id of the user with the given username
		const userId = await User.findOne({username})._id;
		// Verify that a group exists with the given id that the current user is a member of
		await Group.find({_id: groupId, members: userId});
		// Find the message with the given id in the group with the given id
		const message = await Message.findOne({_id: groupId, messageId}).sort({dateSent: 1});

		// Send result
		res.status(200).res.json({success: true, data: message});
	} catch (err) {
		// Report errors
		res.status(500).send({success: false, error: err});
	}
});

/*
 * Route: /api/messages/:groupId
 * Method: POST
 * Auth: Required
 * Desc: Adds a new chat message to the given group with the given content. User must belong to group. Verified by session.
 */
router.post("/:groupId", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const {groupId} = req.params;
	const {content} = req.body;
	const {username} = req.user;

	try {
		// Find the id of the user with the given username
		const senderId = await User.findOne({username})._id;
		// Verify that a group exists with the given id that the current user is a member of
		await Group.findOne({_id: groupId, members: senderId});
		// Create a new message with the given content and sender id
		const newMessage = await new Message({groupId, senderId, content, edited: false}).save();

		// Send result
		res.status(201).json({success: true, data: newMessage});
	} catch (err) {
		// Report errors
		res.status(500).send({success: false, error: err});
	}
});

/*
 * Route: /api/messages/:groupId/:messageId
 * Method: DELETE
 * Auth: Required
 * Desc: Deletes the message with the given id. User must belong to the group and have sent the message or be admin of the group.
 * Verified by session.
 */
router.delete("/:groupId/:messageId", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const {groupId, messageId} = req.params;
	const {username} = req.user;

	try {
		// Find the the user with the given username
		const currentUser = await User.findOne({username})._id;
		// Verify that a group exists with the given id that the current user is a member of
		const group = await Group.findOne({_id: groupId, members: currentUser._id});
		if (group.adminId === currentUser._id) {
			// If current user is group admin, find and delete the message with the given id from the group with the given id
			await Message.findOneAndDelete({_id: messageId, groupId: group._id});
		} else {
			// Otherwise, find and delete the message with the given id in the given group if the current user was the sender
			await Message.findOneAndDelete({_id: messageId, groupId: group._id, senderId: userId});
		}

		// Send result
		res.status(204).send({success: true});
	} catch (err) {
		// Report errors
		res.status(500).send({success: false, error: err});
	}
});

/*
 * Route: /api/messages/:groupId/:messageId
 * Method: PATCH
 * Auth: Required
 * Desc: Updates the content and sets the edited status to true of the message with the given id.
 * User must belong to group and be the sender of the message. Verified by session.
 */
router.patch("/:groupId/:messageId", ensureAuthenticated, async (req, res) => {
	// Gather request parameters
	const {groupId, messageId} = req.params;
	const {content} = req.body;
	const {username} = req.user;

	try {
		// Find the id of the user with the given username
		const senderId = await User.findOne({username})._id;
		// Verify that a group exists with the given id that the current user is a member of
		await Group.findOne({_id: groupId, members: senderId});
		// Find and update content and status of the message with the given id in the given group if the current user was the sender
		const message = await Message.findOneAndUpdate({_id: messageId, groupId, senderId}, {content, edited: true});
		// Send result
		res.status(200).send({success: true, data: message});
	} catch (err) {
		// Report errors
		res.status(500).send({success: false, error: err});
	}
});

module.exports = {router};