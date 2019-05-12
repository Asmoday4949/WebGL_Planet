
// Generate random values from between min and max
function random(min, max)
{
   let range = max - min;
   return (Math.random() * range) + min;
}

// Radian to degree function
function radiansToDegrees(radians)
{
   return radians * 180.0 / Math.PI;
}

// Deep copy
function copyArray(array)
{
   let newArray = [];

   for(let i = 0; i < array.length; i++)
   {
      newArray[i] = array[i];
   }

   return newArray;
}

// Generate random seed
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

// Normalize range of values to 0-1
function convertNormalizedValue(min, max, percent, inverse=false)
{
  if(inverse)
  {
    return max - (min + ((max-min) * percent));
  }
  else
  {
    return min + ((max-min) * percent);
  }
}
