"use strict";

const socket = io();

socket.on("message", message => outputMessage(message));

const chatFeed = document.getElementById("chat_feed");
const submitChatButton = document.getElementById("submit_chat");
const chatInput = document.getElementById("chat_input");

submitChatButton.addEventListener("click", async evt => {
	evt.preventDefault();

	const content = chatInput.value;
	const sender = (await getCurrentUser()).displayName;
	const date = moment(Date.now()).format("MM/DD/YY h:mm a");
	const message = {content, sender, date};
	socket.emit("chatMessage", message);

	const res = await fetch(`/api/messages/${groupId}`, {
		method: "POST",
		body: JSON.stringify({content}),
		headers: {"Content-type": "application/json"}
	});
	const data = await res.json();

	chatInput.value = "";
});

const loadMessages = async () => {
	const res = await fetch(`/api/messages/${groupId}`, {method: "GET"});
	const data = await res.json();

	for (const element of data.data) {
		const {content, senderId, dateSent} = element;
		const sender = await getDisplayNameById(senderId);
		const date = moment(new Date(dateSent)).format("MM/DD/YY h:mm a");
		const message = {content, sender, date};
		outputMessage(message);
	}
};

const getCurrentUser = async () => {
	const res = await fetch(`/api/users`, {method: "GET"});
	const data = await res.json();

	return data.data;
}

	var groupId = window.sessionStorage.getItem("group")
	console.log(groupId)
	// Get the modal
	var modal = document.getElementById("myModal");
	var editmodal = document.getElementById("editModal");
	var delmodal = document.getElementById("deleteModal");
	var card1=document.getElementById("card1")
	var btnContainer=document.getElementById("btn_container")
	console.log("Button container " + btnContainer)
	console.log("Modal " + modal)

	var clicked=false

	var makeTask = function(column) {
	  modal.style.display = "block";
	  currentCol = column
}

const getDisplayNameById = async userId => {
	const res = await fetch(`/api/users/${userId}`, {method: "GET"});
	const data = await res.json();

	return data.data.displayName;
}

const outputMessage = (message) => {
	const div = document.createElement("div");
	div.classList.add("message");
	let {content, sender, date} = message;
	div.innerHTML = `<p class="text">${content}</p><p class="meta">${sender} <span>${date}</span></p>`;
	chatFeed.appendChild(div);
	chatFeed.scrollTop = chatFeed.scrollHeight;
};

// Get the modal
var modal = document.getElementById("myModal");
var editmodal = document.getElementById("editModal");
var delmodal = document.getElementById("deleteModal");
var card1 = document.getElementById("card1");
var btnContainer = document.getElementById("btn_container");
console.log("Button container " + btnContainer);
console.log("Modal " + modal);

var clicked = false;

var makeTask = function (column) {
	modal.style.display = "block";
	currentCol = column;
};

var cancelTask = function (e) {
	e.preventDefault();
	modal.style.display = "none";
};

var closeTask = function (e) {
	e.preventDefault();
	editmodal.style.display = "none";
};

var closeInvite = function (e) {
	e.preventDefault();
	inviteModal.style.display = "none";
};

var keepCol = function () {
	delmodal.style.display = "none";
};

var imodal = document.getElementById("inviteModal");

var invite = async (e) => {
	e.preventDefault()

	const res = await fetch("/api/users/all", {method: "GET"});
	const data = await res.json()
	console.log(JSON.stringify(data))
	var slct = document.getElementById("invitees")
	var iList = data.data
	for(var i = 0; i < iList.length; i++) {
		//Get member names
		var user = iList[i]
		//console.log(modal)
		var opt = document.createElement("option")
		opt.setAttribute('value', user._id)
		opt.appendChild(document.createTextNode(user.username))
		slct.appendChild(opt)
		//slct2.appendChild(opt)
	}
	inviteModal.style.display = "block"
}

var invited = async (e) => {
	e.preventDefault()

	const response = await fetch("/api/groups/" + groupId, {method: "GET"});
	const group = await response.json()
	const input = document.querySelector( '#invitees')
	var invitees = group.data.invitees
	console.log(input.value)
	invitees.push(input.value)
	console.log("Who are we inviting? " + invitees)
	const res = await fetch("/api/groups/" + groupId, {method: "PATCH", body: JSON.stringify({invitees}), headers: {"Content-type": "application/json"}});
	const data = await res.json()
	console.log(JSON.stringify(data))
	inviteModal.style.display = "none"
}

window.onclick = function (event) {
	if (modal === event.target) {
		modal.style.display = "none";
	}
};

// Are we editing?
var editing = true

var openTask = function(task, edit) {
  if(edit == true) {
    editmodal.style.display = "block";
    const input = document.querySelector( '#t_name' )
    const input2 = document.querySelector( '#due__date' )
    const input3 = document.querySelector( '#t_assignee')
    const input4 = document.querySelector( '#t_tags')
    const input5 = document.querySelector( '#t_desc')
		console.log("Assignee? " + task.assignees)
    input.value = task.name
    input2.value = task.dateDue
    input3.value = task.assignees
    input4.value = task.tags
    input5.value = task.desc
  }
}

var listClicked = function(){
  if(clicked){
    console.log(btnContainer)
    btnContainer.style.display="none"
    clicked=false
  }else{
    console.log(btnContainer)
    btnContainer.style.display="block"
    clicked=true
  }
}

const addMe = async () => {
	var h = document.getElementById("group_name");
	var name = h.innerHTML;
	const res = await fetch("/api/", { method: "POST", body: name });
	const data = await res.json();
	console.log(JSON.stringify(data));
	console.log(data);
};

//var groupName; //= "test"; //Change this to be set later
//var groupId;

const getMembers = async (members) => {
	var slct = document.getElementById("tassignees")
	//var slct2 = document.getElementById("t_assignee")
	for(var i = 0; i < members.length; i++) {
		//Get member names
		var member = members[i]
		console.log(member)
		const res = await fetch("/api/users/" + member, {method: "GET"});
	  const data = await res.json()
	  console.log(JSON.stringify(data))
		//console.log(modal)
		var opt = document.createElement("option")
		opt.setAttribute('value', data.data._id)
		opt.appendChild(document.createTextNode(data.data.displayName))
		slct.appendChild(opt)
		//slct2.appendChild(opt)
	}
}

const getMembers2 = async (members) => {
	var slct = document.getElementById("t_assignee")
	//var slct2 = document.getElementById("t_assignee")
	for(var i = 0; i < members.length; i++) {
		//Get member names
		var member = members[i]
		console.log(member)
		const res = await fetch("/api/users/" + member, {method: "GET"});
	  const data = await res.json()
	  console.log(JSON.stringify(data))
		//console.log(modal)
		var opt = document.createElement("option")
		opt.setAttribute('value', data.data._id)
		opt.appendChild(document.createTextNode(data.data.displayName))
		slct.appendChild(opt)
		//slct2.appendChild(opt)
	}
}

const getMyGroup = async () => {
  const res = await fetch("/api/groups/" + groupId, {method: "GET"});
	console.log(groupId)
  const data = await res.json()
	console.log(data)
	var header = document.getElementById("group_name")
	header.innerHTML = "" + data.data.name + "'s Tasks"
  console.log(JSON.stringify(data))
  console.log("Our group: " + groupId)
	console.log(data.data.members)
	getMembers(data.data.members)
	getMembers2(data.data.members)
  getTasks()
}

const getUser = async(mid) => {
	const res = await fetch("/api/users/" + mid, {method: "GET"});
	const data = await res.json()
	console.log("I'm " + data.data.displayName)
	return data.data.displayName
}

const getTasks = async () => {
  const res = await fetch("/api/tasks/" + groupId, {method: "GET"})
  const data = await res.json()
  console.log(JSON.stringify(data))
  //console.log(data.data[0])
  for (var i = 0; i < data.data.length; i++) {
    var task = data.data[i]
		if(task.columnName > cols) {
      console.log("We need to add a new column")
      for(var j = cols; j < task.columnName; j++) {
        addCol()
      }
    }
    const dateStr = task.dateDue;
    console.log(dateStr)
    const date = dateStr.substring(0, 10)
    console.log(date)
		const response = await fetch("/api/users/" + task.assignees, {method: "GET"});
		const user = await response.json()
		var uName = user.data.displayName
    task.dateDue = date
		task.assignees = uName
    appendNewInfo(task)
  }
}

//What column are we adding to?
var currentCol = 1;

var addTask = async (e) => {

  e.preventDefault()

  const input = document.querySelector( '#tname' )
  const input2 = document.querySelector( '#due_date' )
  const input3 = document.querySelector( '#tassignees')
  const input4 = document.querySelector( '#tags')
  const input5 = document.querySelector( '#tdesc')

	const response = await fetch("/api/users/" + input3.value, {method: "GET"});
	const user = await response.json()
	var uName = user.data.displayName

  const json = { name: input.value, desc: input5.value, columnName: currentCol, assignees: input3.value, tags: input4.value, dateDue: input2.value }
  const body = JSON.stringify( json )
  console.log(body)
  console.log(groupId)
  const res = await fetch("/api/tasks/" + groupId, {method: "POST", body: body, headers: {"Content-type": "application/json"}})
  const data = await res.json()
  console.log(JSON.stringify(data))
  console.log(data.data)
  var task = data.data
  const dateStr = task.dateDue;
  const date = dateStr.substring(0, 10)
  task.dateDue = date
	task.assignees = uName
  appendNewInfo(task)
  modal.style.display = "none";
}

var editTask = async (e) => {
  e.preventDefault()
  //Edit the task
  const input = document.querySelector( '#t_name' )
  const input2 = document.querySelector( '#due__date' )
  const input3 = document.querySelector( '#t_assignee')
  const input4 = document.querySelector( '#t_tags')
  const input5 = document.querySelector( '#t_desc')

	const response = await fetch("/api/users/" + input3.value, {method: "GET"});
	const user = await response.json()
	var uName = user.data.displayName

  const tEdit = ids[ids.length-1]
  tEdit.name = input.value
  tEdit.dateDue = input2.value
  tEdit.assignees = input3.value
  tEdit.tags = input4.value
  tEdit.desc = input5.value

  console.log(JSON.stringify(tEdit))

  const res = await fetch("/api/tasks/" + groupId + "/" + tEdit._id, {method: "PATCH", body: JSON.stringify(tEdit), headers: {"Content-type": "application/json"}})
  const data = await res.json()
  console.log(JSON.stringify(data))
  console.log(data)
  const edTask = data.data
  const dateStr = edTask.dateDue;
  console.log(dateStr)
  const date = dateStr.substring(0, 10)
  console.log(date)
  edTask.dateDue = date
	edTask.assignees = uName
  appendNewInfo(edTask, true)
  editmodal.style.display = "none";
}

var delTask = async (task) => {
	const res = await fetch("/api/tasks/" + groupId + "/" + task._id, {
		method: "DELETE",
	});
	const data = await res.json();
	console.log(JSON.stringify(data));
	console.log(data);
	const col = document.getElementsByClassName("tasks");
	var removeTask = document.getElementById(task._id);
	var column = col[task.columnName - 1];
	column.removeChild(removeTask);
};

// Tells us which task was just clicked on
const ids = [];

function appendNewInfo(task, taskEdit = false) {
	// Create elements
	var div = document.createElement("div");
	var name = document.createElement("p");
	var due = document.createElement("p");
	var assigned = document.createElement("p");
	const col = document.getElementsByClassName("tasks");
	var btnDiv = document.createElement("div");
	var deleteBtn = document.createElement("a");
	var del = document.createElement("i");
	// Set attributes
	div.setAttribute("class", "task_card card-panel col s1");
	div.setAttribute("id", task._id);
	name.setAttribute("class", "task_item");
	due.setAttribute("class", "task_item");
	assigned.setAttribute("class", "task_item");
	del.setAttribute("class", "material-icons right");
	deleteBtn.setAttribute(
		"class",
		"centerwaves-effect waves-light btn-small btn"
	);
	btnDiv.setAttribute(
		"style",
		"display:flex; flex-direction: row; justify-items: center"
	);
	// Add things
	del.appendChild(document.createTextNode("delete_forever"));
	deleteBtn.appendChild(del);
	deleteBtn.onclick = function () {
		delTask(task);
		editing = false;
	};
	btnDiv.appendChild(deleteBtn);
	name.appendChild(document.createTextNode(task.name));
	due.appendChild(document.createTextNode(task.dateDue));
	assigned.appendChild(document.createTextNode(task.assignees));
	div.appendChild(name);
	div.appendChild(due);
	div.appendChild(assigned);
	div.appendChild(btnDiv);
	div.onclick = function () {
		console.log(editing);
		openTask(task, editing);
		ids.push(task);
		console.log(ids[ids.length - 1]);
		editing = true;
	};
	console.log(task.columnName);
	if (taskEdit == true) {
		const oldNode = document.getElementById(task._id);
		col[task.columnName - 1].replaceChild(div, oldNode);
	} else {
		col[task.columnName - 1].appendChild(div);
	}
}

//The total number of columns
var cols = 1;

var addCol = function() {
  const contain = document.getElementsByClassName("inner-container")
  //console.log(contain)
  cols++ //update number of columns
  console.log(cols)
	// <a class="btn-floating btn-large waves-effect waves-light teal accent-4 right" id="delete_list"><i class="material-icons right">delete</i></a>
  // Create all the necessary elements
  var newCol = document.createElement("div");
  newCol.setAttribute('class', 'task_lists card-panel teal lighten-2')
  var colID = "col-" + cols
  newCol.setAttribute('id', colID)
	//var dltBtn = document.createElement("a")
	//dltBtn.setAttribute('class', 'btn-floating btn-large waves-effect waves-light teal accent-4 right')
	//var dlt = document.createElement("i")
	//dlt.setAttribute('class', 'material-icons right')
  var newList = document.createElement("div")
  newList.setAttribute('class', 'tasks')
  newList.setAttribute('id', cols)
  var newlistName = document.createElement("h5")
  newlistName.setAttribute('class', 'white-text center-align row')
  var addBtn = document.createElement("a")
  addBtn.setAttribute('class', 'add_task centerwaves-effect waves-light btn-large')
  addBtn.setAttribute('type', 'centerwaves-effect waves-light btn-large')
  var btnID = "btn-" + cols
  addBtn.setAttribute('id', btnID)
  var plus = document.createElement("i")
  plus.setAttribute('class', 'material-icons right')
  // Add everything
  plus.appendChild(document.createTextNode("add"))
	// dlt.appendChild(document.createTextNode("delete"))
	// dltBtn.appendChild(dlt)
	// dltBtn.onclick = function() {
  // 	delCol(cols)
  // }
  addBtn.appendChild(plus)
  addBtn.appendChild(document.createTextNode(" New Task"))
  addBtn.onclick = function() {
    makeTask(cols)
  }
  newlistName.appendChild(document.createTextNode("New List"))
	//newCol.appendChild(dltBtn)
  newCol.appendChild(newlistName)
  newCol.appendChild(newList)
  newCol.appendChild(addBtn)
  newCol.onclick = listClicked
  contain[0].appendChild(newCol)
}

var delCol = function() {
  const contain = document.getElementsByClassName("inner-container")
  var columns = contain[0].children
  // Add this in when we can delete specific columns
  // for(var i = 0; i < columns.length; i++) {
  //
  // }
  var tasks = columns[cols-1].children[1].children
  console.log(tasks)
  if(tasks.length != 0) {
    deleteModal.style.display = "block";
    const deleteCol = document.getElementById("col_del")
    deleteCol.onclick = function() {
      console.log(tasks[0].children[3])
      //tasks[0].children[3].click()
      for(var i = 0; i < tasks.length; i++) {
        //Simulate deleting a task
        editing = false
        tasks[i].children[3].click()
        delTask(ids[ids.length-1])
				location.reload()
      }
    }
  }
  else {
    contain[0].removeChild(contain[0].lastChild)
    cols--
  }
}

var inviteMember = async () => {
	
}



const returnHome = async () => {
	window.location = "/";
};

window.onload = async function () {
	await getMyGroup();

	const tsButton = document.querySelector("#task_submit");
	tsButton.onclick = addTask;

	const ntButton = document.getElementById("btn-1");
	ntButton.onclick = function () {
		makeTask(1);
	};

	const dcButton = document.getElementById("col-1");
	dcButton.onclick = listClicked;

	const backButton = document.getElementById("back_btn");
	backButton.onclick = returnHome;

	const cButton = document.getElementById("cancel");
	cButton.onclick = cancelTask;

	const clButton = document.getElementById("close");
	clButton.onclick = closeTask;

	const kcButton = document.getElementById("keep");
	kcButton.onclick = keepCol;

	const ncButton = document.getElementById("add_list");
	ncButton.onclick = addCol;

	const rcButton = document.getElementById("delete_list");
	rcButton.onclick = delCol;

	const teButton = document.querySelector("#task_edit");
	teButton.onclick = editTask;


	const inviteButton = document.getElementById("invite_btn")
	inviteButton.onclick = invite

	const sendInvite = document.getElementById("inv")
	sendInvite.onclick = invited

	const noInvite = document.getElementById("noinv")
	noInvite.onclick = closeInvite
  
	loadMessages();
}
