const wrapper=document.querySelector(".wrapper"),
inputPart=wrapper.querySelector(".input-part"),
paragraph=inputPart.querySelector(".paragraph"),
inputField=inputPart.querySelector("input"),
locationBtn=inputPart.querySelector("button"),
wIcon=document.querySelector(".weather-part img "),
arrowback=wrapper.querySelector("header i");

const apikey="70d25ee476e8553f87407c9fc3fe1874";
let api;

inputField.addEventListener("keyup", e =>{

    //if the user presses the enter key and the input field is not empty

    if(e.key == "Enter"  && inputField.value != "")
    {
     requestApi(inputField.value);
    }

});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        //if browser supports geolocation API
         navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else
    {
        alert("your browser doesnt support geolocation API");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;//getting the user's geolocation using latitude and longitude
    api =`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetchData();
} 

function onError(error){
    paragraph.innerText = error.message;
    paragraph.classList.add("error");

}

function requestApi(city)
{ 
    api =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    fetchData();
}

function fetchData(){
    paragraph.innerText = "Getting weather details...";
    paragraph.classList.add("pending");

    //getting api response and returning it with parsing into js object and in another
    //then function calling weatherDetails function with parsing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));

}

function weatherDetails(info)
{
    if(info.cod == "404")
    {
        paragraph.innerText = `${inputField.value} is not a valid city name`;
        paragraph.classList.replace("pending","error");
    }else
    {
        const city=info.name;
        const country=info.sys.country;
        const{description,id}=info.weather[0];
        const{feels_like,humidity,temp}=info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }


        //lets pass this values in a particular html element

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city} , ${country}`;
        wrapper.querySelector(".temp .numb-1").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        paragraph.classList.remove("pending","error");
        wrapper.classList.add("active");
        console.log(info);
    }
  
}

arrowback.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
})