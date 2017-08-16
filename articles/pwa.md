## Progressive Web App

17<sup>th</sup> August 2017

I attended DDD Melbourne this past weekend and went to a talk about Progressive Web Apps. This wasn't the first I had heard this name but I figured it would be a good chance to get a better understanding of the topic. The idea of PWAs (as I'll refer to them from now on) it to take a web application and make it "feel" like a native mobile app. There are essentially two parts to achieve this:
- Step 1: Implement a manifest.json file (or similar meta tags)
- Step 2: Use service works to achieve offline support and push notifications

I am only going to talk about step 1 as I have yet to get offline support working. I still think it is quite cool that you can add a few lines of json and when you save the website to your desktop it resembles launching an app. Currently this only works for chrome which is convenient as I have an android phone.

Anyway, the following is the manifest file used on this blog so that when you select "Add to Home Screen" from the chrome browser on your Android device, it looks really nice:

```
{
    "name": "Odd Socks Blog",
    "short_name": "Odd Socks",
    "lang": "en-US",
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#083751",
    "background_color": "#083751",
    "description": "The blog of James Formica.",
    "orientation": "portrait-primary",
    "icons": [{
        "src": "images/james_face_circle.png",
        "sizes": "72x72 96x96 128x128 256x256",
        "type": "image/png"
    }]
}
```

Most of the options are pretty self explanatory so I'll only go through a couple. **display: standalone** is what tell Chrome how to open; whether to include the address bar, or status bar, or full screen. **background_color: #083751** is the background of the splash screen that opens up when you click on the bookmarked app. The splash screen also includes the icon and the **name** on it. This is done automatically for you.  

There is a bunch more to learn about this stuff and hopefully it becomes more widely adopted. For now, I'll just try and get offline support going!