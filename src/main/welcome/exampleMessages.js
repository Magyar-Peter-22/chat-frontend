const user1="Peter";
const user2="John";

//the variables used by the translations
const params={user1,user2};

const exampleMessages = [
    new ExampleMessage(user1, "dialog.m1", true),
    new ExampleMessage(user2, "dialog.m2"),
    new ExampleMessage(user1, "dialog.m3", true),
    new ExampleMessage(user2, "dialog.m4"),
    new ExampleMessage(user1, "dialog.m5", true),
    new ExampleMessage(user2, "dialog.m6"),
    new ExampleMessage(user1, "dialog.m7", true)
]


function ExampleMessage(username, text, isMe) {
    this.username = username;
    this.text = text;
    this.isMe = isMe;
    this.params=params;
}

export default exampleMessages;