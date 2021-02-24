---
title: "Notifications"
layout: msm/form-component
root: "form/notification"
trueRoot: "form"
usage: "This is a"
tags: 
    - current
    - question
    - form
---

{% include msm/components/form/notification/index.html 
class="test"
label="Notification title"
text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation <a>ullamco laboris nisi</a> ut aliquip ex ea commodo consequat."
ul="First set of text|Second set of text|Third set of text"
%}

{% include msm/components/form/notification/index.html 
label="Notification title"
text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
%}

{% include msm/components/form/notification/index.html 
class="tick-list"
label="Notification title"
text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
ul="First set of text|Second set of text|Third set of text"
%}

{% include msm/components/form/notification/index.html 
class="warning"
label="Alert message"
text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation <a>ullamco laboris nisi</a> ut aliquip ex ea commodo consequat."
%}

{% include msm/components/form/notification/index.html 
class="warning"
label="Alert message with bullets"
ul="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <a>tempor incididunt</a> ut labore et dolore magna aliqua.|Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
%}

{% include msm/components/form/notification/index.html 
class="success"
label="Success message"
text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation <a>ullamco laboris nisi</a> ut aliquip ex ea commodo consequat."
%}

{% include msm/components/form/notification/index.html 
class="success"
label="Success message with bullets"
ul="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <a>tempor incididunt</a> ut labore et dolore magna aliqua.|Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
%}