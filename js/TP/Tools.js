
function random(min, max)
{
   let range = max - min;
   return (Math.random() * range) + min;
}

function radiansToDegrees(radians)
{
   return radians * 180.0 / Math.PI;
}

function copyArray(array)
{
   let newArray = [];

   for(let i = 0; i < array.length; i++)
   {
      newArray[i] = array[i];
   }

   return newArray;
}

// Source : https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function generateSeed(length = 10)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
  {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
