---
layout: page
title: Archive
permalink: archive/
---
<ul class="posts">
  {% for post in site.posts %}
    {% unless post.next %}
      <li class="posts-year">{{ post.date | date: '%Y' }}</li>
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <li class="posts-year">{{ post.date | date: '%Y' }}</li>
      {% endif %}
    {% endunless %}
    <li itemscope>
      <p class="posts-item" style="background-image:url('{{ site.baseurl }}/assets/{{ post.slug }}/cover.jpg')">
        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
        <p class="post-date"><span><i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%B %-d" }} - <i class="fa fa-clock-o" aria-hidden="true"></i> {% include read-time.html %}</span></p>
      </p>
    </li>
  {% endfor %}
</ul>
