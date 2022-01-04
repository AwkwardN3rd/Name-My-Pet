firebase.initializeApp({ // this sets it up
     apiKey: "AIzaSyBbT8xtSfSepftOnFtIc-0hvso05ELc2Cg",
    authDomain: "pet-naming-app.firebaseapp.com",
    projectId: "pet-naming-app",

});
const db = firebase.firestore();

//checkSignInState()

//----------------------Sign in user------------------------------
function signInUser(){
  email = document.getElementById("userName").value
  password = document.getElementById("password").value
  
  firebase.auth().signInWithEmailAndPassword(email,password)
  .then((userCredential)=>{
     
    
   window.location.href = "home.html";
  }).catch((error) =>{
    alert("Try again or Create a new User")
  })
}
//----------------------Create user------------------------------
function registerUser(){
  
  email = document.getElementById("userName").value
  password = document.getElementById("password").value
  
  firebase.auth().createUserWithEmailAndPassword(email,password) 
  //maybe move creation of user object to fav function?
    .then((object) =>{
      console.log(object)
      let userID = object.user.uid;
    console.log(userID)
    let names = [];
    let userObject ={
        Favourites:names
    }
    db.collection("Users").doc(userID).set(userObject).then(()=>{
    window.location.href = "index.html";
  })
  })
  .catch((error)=>{
  alert(error.message)
  })
    
}
//----------------------Sign Out user------------------------------
function signOutUser(){
    firebase.auth().signOut().then(() => {
      console.log("user signed out ")
      window.location.href = "index.html";
    })
  }
//----------------------Check user Sign in Status------------------------------
function checkSignInState() {
   firebase.auth().onAuthStateChanged((user)=>{
     if(user && window.location.pathname == "/web104/finalProject/root/index.html") {
       window.location.href = "home.html"   
     } else if(!user && !['/web104/finalProject/root/index.html','/web104/finalProject/root/signUp.html'].includes(window.location.pathname)){
       window.location.href = "index.html"
     }
   })  
  } 
//----------------------Generate Names------------------------------
function generate(){
  db.collection("Names").doc("Categories").get()
  .then(data=>{
    List = document.getElementById("nameList")
    List.innerHTML="";
    
    // ------ Checking which radio input is clicked and printing corisponding name to page-----
  if(document.getElementById("popularNames").checked == true){// ----Popular Names
    if(document.getElementById("male").checked == false && document.getElementById("female").checked == false){ // ----Popular Names(If NEITHER male or female is selected)
      //$('#myModal').modal('show')
      alert("You must have either male, female or both checked if you are looking for Popular names. Other wise please choose another Category.")
      
    }else if(document.getElementById("male").checked == true && document.getElementById("female").checked == true){ // ----Popular Names(If BOTH male and female are selcted)
      let popArrayAll = data.data().Popular.All
      loadNames(popArrayAll)
      
    }else if(document.getElementById("male").checked == true){ // ----Popular Names(If Male is selected)
      let popArrayMale = data.data().Popular.Male
      loadNames(popArrayMale)
      
    }else if(document.getElementById("female").checked == true){ // ----Popular Names(If Female is selected)
      let popArrayFemale = data.data().Popular.Female
      loadNames(popArrayFemale)
    }
  }else if(document.getElementById("foodNames").checked == true){ // ----Food Names
    let foodArray = data.data().Food
      loadNames(foodArray);
    
  }else if(document.getElementById("mythicalNames").checked == true){ // ----Mythical Names
    let mythArray = data.data().Mythical
      loadNames(mythArray) 
    
  }else if(document.getElementById('wackyNames').checked == true){ // ----Wacky Names
    let wackyArray = data.data().Wacky
      loadNames(wackyArray)
    }
  })
}
function loadNames(array){ //loads names to the window
  for(i=1; i<7; i++){
    let random = Math.floor(Math.random()*array.length)
    List = document.getElementById("nameList")
    let name = document.createElement("p")
    name.id = i;
    name.innerText = array[random]
    List.appendChild(name)

    let favIcon = document.createElement("span")
    favIcon.innerHTML = '<svg id="heartIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>'
  
    favIcon.addEventListener("click",(event)=>{ //-------------- Event Listener for Favourite Icon
    FavNames(event)
})
  name.appendChild(favIcon)
  }
}
//----------------------Save & upload to window Favourite names------------------------------
function FavNames(event){
  let userID = firebase.auth().currentUser.uid
  let nameClicked = event.path[3].innerText
  db.collection('Users').doc(userID).get()
  .then(data =>{
  let hostArray = []
  hostArray = data.data().Favourites; // gets names in data base
  hostArray.push(nameClicked)
    let userObject ={
        Favourites:hostArray
      }
    db.collection('Users').doc(userID).set(userObject,{merge:true})
    
  let favList = document.getElementById("favList");
    favList.innerHTML=""
  for(let i=0; i<hostArray.length;i++){
    let favs = document.createElement("p")
    favs.id = i;
    favs.innerText=hostArray[i]
    favList.appendChild(favs)
    
    let deleteIcon = document.createElement("span")
      deleteIcon.innerHTML = '<svg id="deleteIcon" xmlns="http://www.w3.org/2000/svg" width="24"height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>'
      deleteIcon.addEventListener("click",(event)=>{ //-------------- Event Listener for Delete Icon
    deleteFavs(event)
})
  favs.appendChild(deleteIcon)
    }
  })
}
//----------------------Delete Fav button------------------------------
function deleteFavs(event){   
  let userID = firebase.auth().currentUser.uid
  let nameClicked = event.path[3].innerText
  db.collection('Users').doc(userID).get()
  .then(data=>{
    let hostArray = []
    hostArray = data.data().Favourites;
    console.log(hostArray)
    console.log(nameClicked)
    let arrayIndex = hostArray.findIndex(element => element == nameClicked)
    console.log(arrayIndex)
    hostArray.splice(arrayIndex,1)
    console.log(hostArray)
    let userObject ={
        Favourites:hostArray
      }
    db.collection('Users').doc(userID).set(userObject,{merge:true})
    
    let favList = document.getElementById("favList");
    favList.innerHTML=""
  for(let i=0; i<hostArray.length;i++){
    let favs = document.createElement("p")
    favs.id = i;
    favs.innerText=hostArray[i]
    favList.appendChild(favs)
    
    let deleteIcon = document.createElement("span")
      deleteIcon.innerHTML = '<svg id="deleteIcon" xmlns="http://www.w3.org/2000/svg" width="24"height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>'
      deleteIcon.addEventListener("click",(event)=>{ //-------------- Event Listener for Delete Icon
    deleteFavs(event)
})
  favs.appendChild(deleteIcon)
  }
   }) 
}
//----------------------Load Favourites------------------------------
function loadFavs(){
  let userID = firebase.auth().currentUser.uid
  db.collection('Users').doc(userID).get()
  .then(data=>{
    let hostArray = []
    console.log(data)
    hostArray = data.data().Favourites;
    let favList = document.getElementById("favList");
    for(let i=0; i<hostArray.length;i++){
      let favs = document.createElement("p")
      favs.id = i;
      favs.innerText=hostArray[i]
      favList.appendChild(favs)
      
      let deleteIcon = document.createElement("span")
      deleteIcon.innerHTML = '<svg id="deleteIcon" xmlns="http://www.w3.org/2000/svg" width="24"height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>'
      deleteIcon.addEventListener("click",(event)=>{ //-------------- Event Listener for Delete Icon
    deleteFavs(event)
})
  favs.appendChild(deleteIcon)
    }
  })
}
//----------------------Load in Content------------------------------

//loop thorugh an array
function myFun(){
  let myArray = ['Butterscotch', 'Apple',  'Caramel', 'Basil',  'Cinnamon', 'Bagel',  'Coconut', 'Bean(s)',  'Cupcake', 'Biscuit',  'Fondue', 'Butter',  'Fudge', 'Dumpling',  'Huckleberry', 'Falafel',  'Jelly', 'Kale',  'Macaron', 'Lemon',  'Marshmallow', 'Meatball',  'Meringue', 'Nacho',  'Milkshake', 'Oatmeal',  'Mochi', 'Oregano',  'Muffin', 'Peanut',  'Nutella', 'Pepper',  'Nutmeg', 'Pickle(s)',  'Oreo', 'Pumpkin',  'Pancake(s)', 'Quinoa',  'Peaches', 'Raisin',  'Pudding', 'Rhubarb', 'Snickerdoodle', 'Sage',  'Soda', 'Spaghetti',  'Strawberry', 'Tofu',  'Toffee', 'Wonton', 'Ginger', 'Pepper', 'Olive', 'Cookie', 'Honey', 'Candy', 'Cinnamon', 'Pumpkin', 'Snickers', 'Brownie', 'Pickles', 'Peanut', 'Pepper', 'Brownie', 'Chip', 'Taco', 'Nacho', 'Cookie', 'Nugget', 'Marmite', 'Holly', 'Baguette', 'Bao', 'Croissant', 'Pudding', 'Bailey', 'Brandy', 'Coco'];
  let mythArray = ['Achilles', 'Athena', 'Atlas', 'Fauna', 'Hera', 'Hercules', 'Juno', 'Loki', 'Luna', 'Odin', 'Odysseus', 'Phoebe', 'Pluto', 'Victoria', 'Zeus','Aphrodite','Artemis','Aura','Calliope','Cassandra','Clio','Daphne','Diana','Echo','Gaia','Helen','Iris','Melaina','Nyx','Pandora','Penelope','Phaedra','Rhea','Selene','Thalia','Ajax','Argus','Brontes','Damon','Evander','Eros','Helios','Hermes','Jason','Jupiter','Leander','Linus','Mars','Morpheus','Neptune','Pan','Perseus','Poseidon','Theseus','Vulcan']
  let wackyArray = ["Peanut Wigglebutt", "Snuggles Butt Le Lee", "Sir Hog Knucklehead", "Count Flufferton", "Sasha Biggiepotamus Fierce", "Katy Purry", 'Otto Von Longdog', 'Walter Croncat', 'Zippity Do Dawg', 'Joey Banana Pants', 'Airbubble McMuffin', 'Felix Thunder Paws', 'Hamburger Patty', 'Nuttykitty', 'Angus T Brackencrack', 'Senor Meow', 'Mister Buddy Pickles', 'Sassy Brat Kat', 'Waffle Dots', 'Purrscilla', 'Ajax General', 'Autobahn', 'Bacon Bite', 'BEG Von Baconface', 'Beaudacious Maximus', 'Belly Button', 'BC Wompum Stompum', 'Boodles Of Oodles', 'Bobo Prince Of Edinburg', 'Cactus Cooler', 'Bogey The Ebony Ace', 'Creme Bowling Ball', 'Brutus Pancakes', 'Energizer Bunny', 'Butkis', 'Eskimo Pie', 'Chief Tator Tot', 'Fava Bean', 'Der Jaeger Meister', 'Feisty Squeaker', 'FL Martha Washington', 'Felix Thunder Paws', 'Felix Thunder Paws', 'Froot Loops', 'Knuckle Head', 'Fuzzy Wuzzy', 'Kung Fu Seabolt', 'General Ginger Beefy', 'Lambchops', 'Honest Bob', 'Macaroni Al Dente', 'Jazz Purr', 'Mindy Fluffer Nutter', 'Kamakazi Wino', 'Munchkin-Dunkin', 'Lil Big Foot', 'My Buckaroo Buddy', 'Little Funky Monkey', 'No Marley Stoppit', 'Luke Skyhopper', 'Officer Piccadilly', 'Mila Meowsavitch', 'Panda Bear Pandy', 'Miniature Queen', 'Rocko The Porkchop', 'Mooshu Vegetable', 'Rootie Patootie', 'Mr, Sparkle Pants', 'Ruffles Ms Truffles', 'Mr, Purrkins', 'Rump Roast', 'New Shoes', 'Sake Bomb', 'Paddy Cake', 'Scar Huey Von Kitten', 'Parcheezy', 'Sergeant Gumdrop','Princess Two Face', 'Sir Bubba Grunt', 'Shakespurr', 'Snickerdoodle Dandee','Surfer Dude', 'Southern Comfort', 'Tiger Ferocious', 'Tid Bit Tenacious', 'Trick-Or-Treat', 'Tide The Knot', 'Tru-Purr', 'Twyla Punkin Twinkletoes', 'Uncle Father Oscar','Tybalt King Of Cats', 'Vienna Beef', 'Tyrannosaurus Rex', 'Zing Zing','Valentino Wonder Cat', 'Chester Sugarfoot', 'Whiskerus Maximus', 'Gianna Von Doberman', 'Zzyzx', 'Dunkin Butterbeans','Cheesebro', 'Choo Choo Boo Boo', 'Empress', 'Tzu Tzu', 'Farrah Pawcett', 'Fiona Penny Pickles', 'Monsieur Le Colonel Moustache' ,'Tango Mango', 'The Other Dude', 'Yeti Sphaghetti', 'Aeiress Patty White', 'Agnes Gooch', 'Anna Banana Lovelace', 'Atticus Theodore Cutbirth', 'Baby Bam Bam Bono', 'Baran Of The Midnight Sun', 'Barfolomew Barfonopolis', 'Blue Noodle Hans Castellon', 'Bobolina Pinky Poo', 'Brewster Chewybear', 'Casey At The Bat', 'Cashmere T Mcgrew', 'Charlie Corgnelius Mcnolegs', 'Cheeto Batman', 'Daisy Belle Fluffbottoms', 'Dale Junebug Jr', 'Doc Howliday', 'Dog Marley', 'Dr Bannana Pancakes', 'Driving Miss Fancy', 'Ezekiel Bakes The Bread', 'Flupner Dog Lips', 'G Money James Dean Barkington III', 'Governor Clarence Bumblesnout', 'Lucy In The Sky With Diamonds', 'Ozzy Pawsborn Francis', 'Sir Nippit Sandport Barksworth', 'Tiger Copa Khan Ice Cream', 'Tony The Wrench', 'Trooper Von Brushyneck', 'Tuff Stardust Denim', 'Tumble Bumble', 'Tupaw Shakur', 'Turkey Run Dancing Raisin', 'Webster Doodledoodle', 'White Magics Icy Hot', 'Wilber Whiskey Von Doodle', 'Yukons Gold Grand Slam', 'Zeus The Deuce', 'Zyla Blu Whitehead', 'Little Booty Ham Sandwich', 'Isaac Mewton', 'Jabba The Butt', 'Ninja Killer Nine Thousand', 'Obi Wan Catnobi', 'The Great Catsby', 'Whiskerus Maximus', 'Winston Purrchill', 'Amazes Me Penelope', 'Bowie Spartacus', 'Chicken Pants', 'Cisco Allen Mcflashkitty', 'Count Wigglybutt', 'Disco Cheetah', 'Draco Meowfoy', 'Dutchess Mouse Mcmittens', 'Foxy Spreadsheets', 'Humphrey Bojangles', 'Jonathan Supersocks', 'Maximus Mcmarbles', 'Monochromaticat', 'Motley Crouton', 'Mrs. Meowgi', 'Newton Reginald Schibbelhut', 'Old Man Hands', 'Pepper Blue Hotsauce Peters', 'Pistachio Buttons', 'Pocket Change', 'Princess Fairy Boots', 'Reece Whiskerspoon', 'Sassy Oil Spot', 'Scratchy Sir Purr', 'Sergeant Snuggles', 'Sir Boots N Pants', 'Spartacus Creamsicle', 'Stinky Poo Poos', 'Sugar Britches', 'Sunny Summersunburst', 'The Little Muffin Man', 'The Princess Sofia Bean The Third', 'Thumbs Hemingway', 'Tiny Thursday', 'Tom Brady The Cat', 'Toothless Truffle', 'Trouble Boogers', 'Tumtum Mcpuff', 'Tybalt Copperpot', 'Wendy Wondercat']
  let popArrayAll = ["Bailey",   "Bella",    "Lucy",    "Daisy",    "Molly",    "Lola",    "Sophie",    "Sadie",    "Maggie",    "Chloe",    "Bailey",    "Roxy",    "Zoey",    "Lily",    "Luna",    "Coco",    "Stella",    "Gracie",    "Abby",    "Penny",    "Zoe",    "Ginger",    "Ruby",    "Rosie",    "Lilly",    "Ellie",    "Mia",    "Sasha",    "Lulu",    "Pepper",    "Nala",    "Lexi",    "Lady",    "Emma",    "Riley",    "Dixie",    "Annie",    "Maddie",    "Piper",    "Princess",    "Izzy",    "Maya",    "Olive",    "Cookie",    "Roxie",    "Angel",    "Belle",    "Layla",    "Missy",    "Cali",    "Honey",    "Millie",    "Harley",    "Marley",    "Holly",    "Kona",    "Shelby",    "Jasmine",    "Ella",    "Charlie",    "Minnie",    "Willow",    "Phoebe",    "Callie",    "Scout",    "Katie",    "Dakota",    "Sugar",    "Sandy",    "Josie",    "Macy",    "Trixie",    "Winnie",    "Peanut",    "Mimi",    "Hazel",    "Mocha",    "Cleo",    "Hannah",    "Athena",    "Lacey",    "Sassy",    "Lucky",    "Bonnie",    "Allie",    "Brandy",    "Sydney",    "Casey",    "Gigi",    "Baby",    "Madison",    "Heidi",    "Sally",    "Shadow",    "Coco",    "Pebbles",    "Misty",    "Nikki",    "Lexie",    "Grace",    "Sierra",  "Boo",  "Charlie", "Jasmine",   "Loki",   "Luna",    "Maggie",  "Midnight",   "Mimi",   "Missy",    "Misty",    "Mittens",  "Shadow", "Max",    "Buddy",   "Chester",  "Charlie",    "Jack",    "Cooper",    "Rocky",    "Toby",    "Tucker",    "Jake",    "Bear",    "Duke",    "Teddy",    "Oliver",    "Riley",    "Bailey",    "Bentley",    "Milo",    "Buster",    "Cody",    "Dexter",    "Winston",    "Murphy",    "Leo",    "Lucky",    "Oscar",    "Louie",    "Zeus",    "Henry",    "Sam",    "Harley",    "Baxter",    "Gus",    "Sammy",    "Jackson",    "Bruno",    "Diesel",    "Jax",    "Gizmo",    "Bandit",    "Rusty",    "Marley",    "Jasper",    "Brody",    "Roscoe",    "Hank",    "Otis",    "Bo",    "Joey",    "Beau",    "Ollie",    "Tank",    "Shadow",    "Peanut",    "Hunter",    "Scout",    "Blue",    "Rocco",    "Simba",    "Tyson",    "Ziggy",    "Boomer",    "Romeo",    "Apollo",    "Ace",    "Luke",    "Rex",    "Finn",    "Chance",    "Rudy",    "Loki",    "Moose",    "George",    "Samson",    "Coco",    "Benny",    "Thor",    "Rufus",    "Prince",    "Chester",    "Brutus",    "Scooter",    "Chico",    "Spike",    "Gunner",    "Sparky",    "Mickey",    "Kobe",    "Chase",    "Oreo",    "Frankie",    "Mac",    "Benji",    "Boots",    "Bubba",    "Buddy",     "Champ",    "Brady",    "Elvis",    "Copper",    "Cash",    "Archie",    "Walter",  "Felix",    "Fluffy",    "Garfield",  "Gizmo",    "Jasper",    "Milo",   "Mittens",   "Precious",  "Snickers",    "Snowball",    "Snuggles",    "Socks",   "Whiskers"]
  
  let popArrayFemale = [ "Bailey",   "Bella",    "Lucy",    "Daisy",    "Molly",    "Lola",    "Sophie",    "Sadie",    "Maggie",    "Chloe",    "Bailey",    "Roxy",    "Zoey",    "Lily",    "Luna",    "Coco",    "Stella",    "Gracie",    "Abby",    "Penny",    "Zoe",    "Ginger",    "Ruby",    "Rosie",    "Lilly",    "Ellie",    "Mia",    "Sasha",    "Lulu",    "Pepper",    "Nala",    "Lexi",    "Lady",    "Emma",    "Riley",    "Dixie",    "Annie",    "Maddie",    "Piper",    "Princess",    "Izzy",    "Maya",    "Olive",    "Cookie",    "Roxie",    "Angel",    "Belle",    "Layla",    "Missy",    "Cali",    "Honey",    "Millie",    "Harley",    "Marley",    "Holly",    "Kona",    "Shelby",    "Jasmine",    "Ella",    "Charlie",    "Minnie",    "Willow",    "Phoebe",    "Callie",    "Scout",    "Katie",    "Dakota",    "Sugar",    "Sandy",    "Josie",    "Macy",    "Trixie",    "Winnie",    "Peanut",    "Mimi",    "Hazel",    "Mocha",    "Cleo",    "Hannah",    "Athena",    "Lacey",    "Sassy",    "Lucky",    "Bonnie",    "Allie",    "Brandy",    "Sydney",    "Casey",    "Gigi",    "Baby",    "Madison",    "Heidi",    "Sally",    "Shadow",    "Coco",    "Pebbles",    "Misty",    "Nikki",    "Lexie",    "Grace",    "Sierra",  "Boo",  "Charlie", "Jasmine",   "Loki",   "Luna",    "Maggie",  "Midnight",   "Mimi",   "Missy",    "Misty",    "Mittens",  "Shadow"]
  
  let popArrayMale = ["Max",    "Buddy",   "Chester",  "Charlie",    "Jack",    "Cooper",    "Rocky",    "Toby",    "Tucker",    "Jake",    "Bear",    "Duke",    "Teddy",    "Oliver",    "Riley",    "Bailey",    "Bentley",    "Milo",    "Buster",    "Cody",    "Dexter",    "Winston",    "Murphy",    "Leo",    "Lucky",    "Oscar",    "Louie",    "Zeus",    "Henry",    "Sam",    "Harley",    "Baxter",    "Gus",    "Sammy",    "Jackson",    "Bruno",    "Diesel",    "Jax",    "Gizmo",    "Bandit",    "Rusty",    "Marley",    "Jasper",    "Brody",    "Roscoe",    "Hank",    "Otis",    "Bo",    "Joey",    "Beau",    "Ollie",    "Tank",    "Shadow",    "Peanut",    "Hunter",    "Scout",    "Blue",    "Rocco",    "Simba",    "Tyson",    "Ziggy",    "Boomer",    "Romeo",    "Apollo",    "Ace",    "Luke",    "Rex",    "Finn",    "Chance",    "Rudy",    "Loki",    "Moose",    "George",    "Samson",    "Coco",    "Benny",    "Thor",    "Rufus",    "Prince",    "Chester",    "Brutus",    "Scooter",    "Chico",    "Spike",    "Gunner",    "Sparky",    "Mickey",    "Kobe",    "Chase",    "Oreo",    "Frankie",    "Mac",    "Benji",    "Boots",    "Bubba",    "Buddy",     "Champ",    "Brady",    "Elvis",    "Copper",    "Cash",    "Archie",    "Walter",  "Felix",    "Fluffy",    "Garfield",  "Gizmo",    "Jasper",    "Milo",   "Mittens",   "Precious",  "Snickers",    "Snowball",    "Snuggles",    "Socks",   "Whiskers"]
  
  let object = {
        Food:myArray,
        Popular:{Male:popArrayMale,Female:popArrayFemale,All:popArrayAll},
        Mythical:mythArray,
        Wacky:wackyArray
      }
     console.log(object)
    db.collection('Names').doc('Categories').set(object)
}
