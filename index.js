/**
 * Sets a cookie with the given name, value, and expiration days.
 *
 * @param {string} name - The name of the cookie to set.
 * @param {string} value - The value to assign to the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

/**
 * Retrieves the value of a cookie by its name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @return {string|null} The value of the cookie, or null if the cookie is not found.
 */
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

/**
 * Clears all cookies by setting their expiration date to the past.
 *
 * @return {void} This function does not return anything.
 */
function clearAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

/**
 * Retrieves the details of the cookie.
 *
 * @return {Object} An object containing the red count, blue count, and the color.
 */
function getCookieDetails() {
  var previousColor = getCookie('color') || '';

  var color = (previousColor !== "") 
    ? previousColor 
    : Math.random() < 0.5 
      ? 'red' 
      : 'blue';

  setCookie('color', color, 365);

  var redCount = parseInt(getCookie('redCount')) || 0;
  var blueCount = parseInt(getCookie('blueCount')) || 0;

  if (color === 'red') {
    redCount++;
    setCookie('redCount', redCount, 365);
  } else {
    blueCount++;
    setCookie('blueCount', blueCount, 365);
  }

  return {
    redCount: redCount,
    blueCount: blueCount,
    previousColor: previousColor,
    color: color
  };
}

/**
 * Creates an SVG ball element and appends it to the document body.
 *
 * @param {Object} args - An object containing the width, height, center coordinates, radius, and fill color of the ball.
 * @param {string} args.w - The width of the SVG element.
 * @param {string} args.h - The height of the SVG element.
 * @param {string} args.cx - The x-coordinate of the center of the circle.
 * @param {string} args.cy - The y-coordinate of the center of the circle.
 * @param {string} args.r - The radius of the circle.
 * @param {string} args.fill - The fill color of the circle.
 */
function showSvgBall(args) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute('width', args.w);
  svg.setAttribute('height', args.h);

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  circle.setAttribute('cx', args.cx);
  circle.setAttribute('cy', args.cy);
  circle.setAttribute('r', args.r);
  circle.setAttribute('fill', args.fill);

  svg.appendChild(circle);

  document.querySelector("#ball").appendChild(svg);
}

/**
 * Updates the text content of the red and blue count elements.
 *
 * @param {number} redCount - The value to display for the red count.
 * @param {number} blueCount - The value to display for the blue count.
 * @param {string} previousColor - The color of the previous ball.
 * @return {void} No return value.
 */
function showLabels(redCount, blueCount, previousColor) {
  document.querySelector("#redCount").textContent = redCount;
  document.querySelector("#blueCount").textContent = blueCount;

  var previousColorInnerHTML = "-";

  if (previousColor === "blue") {
    previousColorInnerHTML = '<span style="color: blue;">Blue</span>';
  } else if (previousColor === "red") {
    previousColorInnerHTML = '<span style="color: red;">Red</span>';
  }

  document.querySelector("#previousColor").innerHTML = previousColorInnerHTML;
}

/**
 * Initializes the application by retrieving the cookie details and generating a random ball color.
 *
 * @return {void} This function does not return anything.
 */
function start() {
  var cookieDetails = getCookieDetails();
  console.log("cookieDetails:", JSON.stringify(cookieDetails, null, 2));

  var ballContainer = document.querySelector("#ball");
  ballContainer.innerHTML = "";

  showSvgBall({ w: 100, h: 100, cx: 50, cy: 50, r: 50, fill: cookieDetails.color });
  showLabels(cookieDetails.redCount, cookieDetails.blueCount, cookieDetails.previousColor);
}

document.addEventListener("DOMContentLoaded", function () {
  start();
});