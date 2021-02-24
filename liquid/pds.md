---
layout: gxp/default
title: Product Design Sprints
permalink: /pds/
---
<ul>
    {% for ds in site.pds %}
        <li>
        <a href="{{ ds.url }}">{{ ds.title }}</a>
        </li>
    {% endfor %}
</ul>