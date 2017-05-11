## Building a chocolate engraver in 24 hours 🍫

11<sup>th</sup> May 2017

From lunchtime on the 4<sup>th</sup> to lunchtime on the 5<sup>th</sup> of May we formed teams and were tasked with creating anything we wanted then to present that idea at the end of the 24 hours. Most commonly known as a 'Hackathon' or a 'Hack Day' (although we called it 'Innovation Day') it is a mutual beneficial exercise for both employer and employees. The business gets new ideas and the participants get an opportunity to forget about their usual day to day. They are fun, they are silly and they present the chance to make something you would never have made otherwise. This was no exception to our team who decided we were going to build A.C.E. The Awesome Chocolate Engraver!  

Leveraging the fact that one of our team members owned a 3D printer, we took the printing head off and replaced it with a Dremmel. We then [created a Web Application](https://jamesformica.github.io/ace/) that allowed you to draw on a canvas and overlay some text. The next step was the trickiest. We needed to write an algorithm that would turn the canvas into G-Code which the 3D printer understands. At a high level, the algorithm traversed each pixel looking for a non-white pixel and would then begin search for others around it. We ended up with an outline of the non-white shapes on the canvas which is  what the 3D printer would mill into the chocolate.  

So turns out there's a few problems with engraving chocolate:
1. It melts. As the Dremmel milled the chocolate it would warm up and melt the chocolate if it spent too long in an area. Despite the fact that these blocks had been sitting in a freezer.
2. Chocolate sticks to itself. As the lines were milled, the bits that were removed just turned into flakes and filled stuck to the chocolate block. We had to remove a lot of flakes with a knife.
3. It's hard to find a balance. You don't want to drill too deep cause it will ruin the chocolate, but you also dont want to do too many layers cause it will take too long and melt the chocolate. We never did find the best balance, but at least all the stuff ups were yummy!

Here are a bunch of photos of the day:

![Progress](images/ace/progress1.jpg)
Setting up the 3D printer (it was huge)

![Selfie](images/ace/progress2.jpg)
Obligatory genY selfie

![Control](images/ace/printercontrol.png)
The software that runs the 3D printer where we uploaded our G-Code files

![Robot](images/ace/robotgcode.png)
A wireframe of the path the 3D printer will take. The red lines are where it has to jump to different sections

![Chocolate](images/ace/chocolate1.jpg)
Making the chocolate blocks

![Chocolate](images/ace/chocolate2.jpg)
Adding some white chocolate on the top

![Mic](images/ace/mic.jpg)
An engraving of a microphone

![Note](images/ace/note.jpg)
An engraving of a music note

![Pacman](images/ace/pacman.jpg)
An engraving of pacman

![Robot](images/ace/robot.jpg)
An engraving of a robot

![Snowman](images/ace/snowman.jpg)
An engraving of a snowman

![Desk](images/ace/desk.jpg)
An engraving of a standup desk lol

![People](images/ace/people.jpg)
An engraving of the silhouette of 3 people

![Logo](images/ace/starrezlogo.jpg)
An engraving of the company logo