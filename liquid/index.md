---
layout: gxp/default
title: MSM GXP
permalink: /gxp/
---

<h1>Available components</h1>
<ul>
    {% for component in site.components %}
    <li>
        <a href="/components/{{ component.root }}">{{ component.title }}</a>
    </li>
    {% endfor %}
</ul>