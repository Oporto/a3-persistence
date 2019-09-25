console.log("Welcome to assignment 2!")

const genTable = function(data){
    var table = new Tabulator("#readings-table", {
        data:data, //assign data to table
        layout:"fitColumns", //fit columns to width of table (optional)
        selectable:"true",
        rowDblClick:function(e, row){
            var r = confirm("Are you sure you want to delete this row?");
            if (r == true) {
                row.delete()
            }
        },
        columns:[ //Define Table Columns
            {title:"Speed (MPH)", field:"speed", editor:"input", width:140},
            {title:"Rotations per Minute (0-1000)", field:"rpm", editor:"input", width:250, formatter: "progress", formatterParams: {
                min:0,
                max:1000,
                color:["red","orange","green","blue", "green","orange", "red"],
                legendColor:"#000000",
                legendAlign:"center",
            }},
            {title:"Gear", field:"gear", editor:"select",width:120, editorParams:{
                "Park":"Park",
                "Reverse":"Reverse",
                "1st Gear":"1st Gear",
                "2nd Gear":"2nd Gear",
                "3rd Gear":"3rd Gear",
                "4th Gear":"4th Gear",
                "5th Gear":"5th Gear",
                "6th Gear":"6th Gear"
            }},
            {title:"Timestamp", field:"datetime", sorter:"date", align:"center", width:290},

        ],
        
        dataEdited:function(data){
            console.log(data)
            update(data)
        },
   });    
}

const agrTable = function(data){
    var agrTable = new Tabulator("#aggregate-table",{
        height: 280,
        data:data,
        layout:"fitColumns",
        columns:[
            {title:"Gear", field:"gear"},
            {title:"Average Speed", field:"avgspeed"}
        ]
    })
}

const getReadings = function(){

    fetch('/reading_data')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        genTable(data)
    })
    .catch(err => {
        console.log(err)
    })

    fetch('/aggregate_data')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        agrTable(data)
    })
    .catch(err => {
        console.log(err)
    })
}

const update = function(data){
    json = {
        readings:data
    }
    json_st = JSON.stringify(json)
    fetch( '/update_delete', {
        method:'POST',
        body:json_st,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( function( response ) {
        console.log(response)
        getReadings()
    })
}

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault()

    const speed = document.querySelector( '#speed' ),
        rpm = document.querySelector('#rpm'),
        gear = document.querySelector('#gear'),
        json = { 
            speed: speed.value,
            rpm: rpm.value,
            gear: gear.value,
            datetime: (new Date()).toJSON()
        },
        json_st = JSON.stringify( json )

    fetch( '/submit', {
        method:'POST',
        body: json_st,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( function( response ) {
        console.log(response)
        getReadings()
    })

    return false
}

window.onload = function() {
    fetch('/api/user_data')
    .then(response => response.json())
    .then(data =>{
        this.document.getElementById("intro").innerHTML = "Welcome to the data logger, " + data.user.profile.displayName
    })
    const button = document.querySelector( 'button' )
    button.onclick = submit
    getReadings()
}

