---
title: "Watermark Removal and Integrated Super-Resolution on Anime Pictures"
tags: [machine learning, anime, image processing]
caption: Bathers (1874–75) by Paul Cézanne
---

Some months ago I was writing messages with an online acquaintance I know from a German anime forum that's shut down by now. Let's call him *Mr. Berg*. During that time I was also working on [my Bachelor's thesis](https://github.com/leyhline/vix-term-structure/blob/master/thesis/thesis.pdf) about [Deep Learning](https://en.wikipedia.org/wiki/Deep_learning) (some trendy machine learning method). I was also thinking about applying these techniques on anime stuff just for the fun of it. These models can have an arbitrarily large input and/or output. Meaning: It's perfectly possible to generate whole images using Deep Learning.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/deepdream_sky.jpg" alt="Looking at the sky, dreaming">
    <br>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/deepdream_skyanimals.jpg" alt="Close up of some dreamed up sky animals">
    <figcaption>
    Exemplary transformation by Google's DeepDream, taken from <a href="https://research.googleblog.com/2015/06/inceptionism-going-deeper-into-neural.html">the original blog post</a>.
    <br>
    Since the model was trained on lots of animal pictures it tries to spot them, even if nothing's there, resulting in such hallucinations.</figcaption>
</figure>

I was already planning on collecting data (i.e. anime pictures) and throwing it at some standard models like Google's classical [DeepDream](https://research.googleblog.com/2015/06/inceptionism-going-deeper-into-neural.html). Long-term goal is of course to generate professional-quality artwork just from a few keywords but that's far from possible at the moment. Fortunately Mr. Berg had a problem that might be easily solvable with today's technology. If you ever read this: I really owe you one for this idea. It's right in the scope of what I can accomplish with my limited resources.

## Problem description

Mr. Berg is a diehard fan of an anime called [Coppelion](https://myanimelist.net/anime/9479/Coppelion). The series has quite an interesting look but at the end it only received mixed reviews. Therefore, not much merchandise is available. By stalking the the staff's twitter or something he got some small sample pictures of official artwork.

<figure>
    {% assign sample_width = "130px" %}
    {% assign sample_display = "inline" %}
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/sample1.jpg" alt="Coppelion sample 1" style="max-width:{{ sample_width }};display:{{ sample_display }};">
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/sample3.jpg" alt="Coppelion sample 2" style="max-width:{{ sample_width }};display:{{ sample_display }};">
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/sample4.jpg" alt="Coppelion sample 2" style="max-width:{{ sample_width }};display:{{ sample_display }};">
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/sample6.jpg" alt="Coppelion sample 2" style="max-width:{{ sample_width }};display:{{ sample_display }};">
    <figcaption>
    © King Record Co., Ltd.
    </figcaption>
</figure>

Looking at these pictures one can't help but notice a few things:
* They are damn small (the original resolution is 233x330 pixels).
* There is a large **SAMPLE** watermark.
* All images have exactly the same watermark.

Well, that's obviously too small for printing a poster or ordering a custom [Dakimakura](http://www.dannychoo.com/en/post/1646/Dakimakura.html) (you might not to want to click on this link while at work). What we need to do is:

### 1. Remove the watermark

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/sample2.jpg" alt="Coppelion sample 2" style="max-width:42%;display:inline-block;">
    <p style="display:inline-block;vertical-align:top;font-size:5em;">➧</p>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/clean2.jpg" alt="Coppelion cleaned sample 2" style="max-width:42%;display:inline-block;">
    <figcaption>
    This watermark got removed by hand by Mr. Berg himself. He asserted that he has no artistic talent whatsoever.
    </figcaption>
</figure>

Depending on the level of detail of the specific image this might be possible for any human with basic Photoshop skills. But it's very time consuming since every line and every color has to be chosen carefully.

For a computer it's possible, too. If the computer can distinguish the watermark from the picture itself it can look at the surrounding pixels and with some mathematical optimization incrementally remove parts of the watermark until it's gone completely. [Google had a nice paper about this](https://research.googleblog.com/2017/08/making-visible-watermarks-more-effective.html) last year. 
Unfortunately this approach won't work in our case since there are neither enough images with an identical watermark to make distinction possible, nor is it unobtrusive enough. You see, it's <span style="font-size:1.5em;">large</span> and **bold** and <span style="text-shadow: 0px 0px 5px #f00;">glowing</span>! This makes it hard to get things right if you only look at some numbers in a small surrounding area. It might be easier if you know that you're supposed to draw some anime girls.

### 2. Enlarge without loss of quality

This is supposedly solved by [waifu2x](http://waifu2x.udp.jp/) which also uses Deep Learning for upscaling anime pictures. It's very popular in the community.

<figure>
    <img src="{{ site.baseurl }}/assets/{{ page.slug }}/waifu2x.png" alt="waifu2x example">
    <figcaption>
    Taken from the the project's <a href="https://github.com/nagadomi/waifu2x">Github repository</a> showing the popular virtual idol Hatsune Miku from the Vocaloid software (<a href="http://piapro.net/en_for_creators.html">CC BY-NC by piapro</a>).
    </figcaption>
</figure>

The paper presenting the underlying theory itself is from 2015. By now there might be some more advanced techniques and models. That's something I have to explore some more at a later time.

But what's important to realize is the limit of super-resolution. Scaling the image up too much is like drawing something completely new. A flower seen from afar might just be a blob of color in our eyes. But up close it's a complex organic life form where every petal has it's own highly individual texture and form. If we were to draw these details on our own, where would they come from?