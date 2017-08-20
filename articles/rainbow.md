## Rainbow Bomb (js function) 🌈 💥 

21<sup>st</sup> August 2017

Recently, I decided to give this blog a UI makeover. I decided that it was too bland. We have all amazing vibrant colours available to us, yet we stick to the same old styles and play it safe. WELL, NO MORE! Look at all this colour! Ok, maybe I went a little overboard but that just means I'm compensating for the rest of the blogs out there.  

Firstly, I needed to pick some colours to use. I wasn't going to type in random hex values cause I always end up with some horrific green-brown mixture that I pray to never see again. I usually go to [Colour Lovers](http://colourlovers.com.au) but I realised I always pick roughly the same palette every time I go there. This time I mixed it up. This time I did something that no one has ever done before in the existence of the human race. This time... I used an eyedropper tool on my display picture over there ↖ and picked three bold, bright colours: pink 🐷, sky blue 💧, and yellow 🌞.  

I decided I wanted these colours to alternate each character of the site title (and other headings) so off I went assuming I could do this with child selectors in CSS. 🚫 NOPE! Okay fine, if CSS doesn't want to play nice, I'll just use our good ol' friend Javascript. I created a monster! Not really, I created a nice little function that looks for any elements with a certain class, then RAINBOW BOMBS them all!!!  

Here is the function:
```
var colours = ["#F2A7D9", "#6FDBCF", "#F4D84C"];
var rainbows = document.getElementsByClassName("ui-rainbow");

for (var i = 0; i < rainbows.length; i++) {
    var _rainbow = rainbows[i];
    var text = _rainbow.innerHTML;
    var rainbowEffect = "";

    for (var j = 0, counter = 0; j < text.length; j++) {
        if (text[j] === ' ') {
            rainbowEffect += ' ';
        } else {
            rainbowEffect += '<span style="color:' + colours[counter % colours.length] + '">' + text[j] + '</span>';
            counter++;
        }
    }
    _rainbow.innerHTML = rainbowEffect;
}
```

It works the way you would expect. Nothing fancy. It finds each element to convert, loops through each letter in the text and creates a separate ```<span>``` tag with a style specifying the colour. There is a simple ```if``` statement to skip over any spaces, but other than that it is a really simple little function.

That's all folks!