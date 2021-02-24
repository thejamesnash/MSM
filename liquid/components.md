---
layout: gxp/component
title: Site components
permalink: /components/
---
{% for component in site.components %}
<article data-tags="{{ component.tags }}">
<h1><a href="{{component.url}}">{{ component.title }}</a></h1>
</article>
{% endfor %}
