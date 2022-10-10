# Training Plan Generator
**A fullstack web app to automatically generate individually tailor training plans for runners**

**Problem:** 
Training plans for runners take a while to create when you're doing it by hand and thus cost more.  If I can automate the process custom training plans can become availble to a wider audicen due to the lower cost.

**Solution:**
Create a wesbite that allows people to register and create custom training plans for themselves based on a number of inputs including: start date, most miles in a week, longest long run, and average run pace.  Since users are registerd they may sign back in at any time to view their training plan.

**Link to project:** https://vercel.com/christolandry/ascent-running-training-plan-generator
![alt tag](trainingPlanGenerator.gif)

## How It's Made:

**Tech used:** Node.js, JavaScript, Express, MongoDb, MVC Architecture

<h6>Creation of the Training Plan</h6>
<p>The user initially creates a weekly training schedule, deciding which day they will do the Long Run, Primary Workout, Secondary Workout, Maintenance Runs, and rest</p>
<p>Second the user enter data about their start date, the duration of the training plan, how long they want their longest week and long run to be, and their normal running pace.</p>
<h6>Training Plan Calendar</h6>
<p>This is the page a user is redirected to if they have a training plan upon sign in.</p>
<p>It displays a calendar with instructions for each day listed.  Users can click on days to get more specific information each run.</p>

### Credits
<p>Calendar: Was taken from here: https://codepen.io/bbarry/pen/jOQNjX and then modified.</p>

## Lessons Learned:

Creating a full-stack web app using JavaScript, Node.js, & Express.  Some of the more difficult parts were integrating the calendar into my webpage, adapting it to my needs, wrangling with dates (specically the timezones assciated with the dates), sending data from server-side JS to client-side JS to create the events on the calendar, and figuring out how to host a Node.js program on Vercel for the first time. I overcame these blockers through many google searches, a helpful discord sever, reading the documentation, and more than a little testing.

## Optimizations:
<ul>
  <li>Fix bugs</li>
    <ul>
        <li>Have screen only show landscape mode on mobile</li>
        <li>Some text is translated down slightly</li>
    </ul>
  <li>Add in race distance options other than the marathon</li>
  <li>Move the current client side JavaScript used to create the calendar server side</li>
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
