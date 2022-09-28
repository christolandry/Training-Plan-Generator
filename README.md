# Training Plan Generator
**A fullstack web app to automatically generate individually tailor training plans for runners**

**Problem:** 
Training plans for runners take a while to create when you're doing it by hand and thus cost more.

**Solution:**
Create an app that allows people to register and create custom training plans for themselves based on a number of inputs such as: start date, most miles in a week, longest long run, and average run pace.  Since users are registerd they may sign back in at any time to view their training plan.

**Link to project:** Hosted project coming soon
https://github.com/christolandry/Training-Plan-Generator
![alt tag](trainingPlanGenerator.gif)

## How It's Made:

**Tech used:** Node.js, JavaScript, Express, MongoDb, MVC Architecture

<h6>Creatation of Training Plan</h6>
<p>First step is for the user to create a weekly training schedule, deciding which day(s) is for the Long Run, Primary Workout, Secondary Workout, Maintenance Runs and rest</p>
<p>Second the user enters in data about start date, what race distance they're training for, the duration of the training plan in weeks, how long they want their longest week and long run to be, and their normal running pace.</p>
<p>Upon submission a training plan specific to that data is then created and displayed for the user</p>
<h6>Training Plan Calendar</h6>
<p>This is the page a user is redirected to if they have a training plan upon sign in</p>
<p>It displays a calendar with the training for each day listed.  Users can click on days to get more specific information each run</p>

### Sources
<p>Calendar: Was taken from here: https://codepen.io/bbarry/pen/jOQNjX and then modified to fit my uses. </p>

## Lessons Learned:

Creating a full-stack web app in the MERN tech stack.  Some of the more difficult parts were integrating the calendar into my webpage and needing to read and understand the code before I coudl figure out how to modify it to my need, wrangling with dates (specically the timezones assciated with the dates), and sending data from server-side JS to client-side JS to create the events on the calendar. I overcame these blockers though many google searches, a helpful discord sever, reading the documentation, and testing.

## Optimizations:
<ul>
  <li>Add in more options to choose from when createing the training program including:
    <ul>
        <li>Number of running days</li>
        <li>Duration of training plan</li>
        <li>Distance of race</li>
    </ul>
  </li>
  <li>Move the current client side JavaScript used to create the calendar client side</li>
  <li>Have a large number of people create training plans and stress test the logic behind the creation</li>
  <li>Start charging for training plans</li>
</ul>

## Examples:
Take a look at these couple examples that I have in my own portfolio:

**Portfolio Page:** https://github.com/christolandry/Portfolio

**Charlotte Astrophiles:** https://github.com/christolandry/Charlotte-Astrophiles

**Happy Tails Dog Grooming:** https://github.com/christolandry/Happy-Tails

**Ascent Running Camp:** https://github.com/christolandry/AscentRunningCamp

**Professional Runner (retired):** https://ChristoLandry.com

**Ascent Running Coaching:** https://AscentRunningCoaching.com
