---
title: "Watermark Removal and Integrated Super-Resolution on Anime Pictures"
tags: [machine learning, anime, image processing]
caption: Bathers (1874–75) by Paul Cézanne
---

Some months ago I was writing messages with an online acquaintance I know from some by now shut down anime forum. Let's call him *Mr. Berg*. During that time I was also working on my Bachelor's thesis about [Deep Learning](https://en.wikipedia.org/wiki/Deep_learning) (some trendy machine learning method). I was also thinking about applying these techniques on anime stuff just for the fun of it. These models can have an arbitrarily large input and/or output. Meaning: It's perfectly possible to generate whole images using Deep Learning.

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