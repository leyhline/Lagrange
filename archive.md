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
      <a class="posts-item" href="{{ site.baseurl }}{{ post.url }}" style="background-image:url('{{ site.baseurl }}/assets/{{ post.slug }}/cover.jpg')">
        <p>
          {{ post.title }}
          <br>
          <span class="post-date">
            <i class="fa fa-calendar" aria-hidden="true"></i> {{ post.date | date: "%B %-d" }} - <i class="fa fa-clock-o" aria-hidden="true"></i> {% include read-time.html %}
          </span>
        </p>
      </a>
    </li>
  {% endfor %}
</ul>
