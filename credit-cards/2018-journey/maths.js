var MSMAdsarCreditCardCalculator=function(t){var e=function(t){var e=t.toFixed(2).split(".");e[0]=e[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");var a=e.join(".");return".00"===a.slice(-3)&&(a=a.slice(0,-3)),a},a=function(t,e){e=e||0;var a=String(t);return t%1&&(a=a.replace(/5$/,"6")),Number((+a).toFixed(e))},r=["January","February","March","April","May","June","July","August","September","October","November","December"],n=function(t){return r[t.getMonth()]},o=function(t){var e=new Date;return e.setDate(1),e.setMonth(e.getMonth()+t),e.setDate(Math.min(e,function(t,e){return[31,(a=t,a%4==0&&a%100!=0||a%400==0?29:28),31,30,31,30,31,31,30,31,30,31][e];var a}(e.getFullYear(),e.getMonth()))),e},l=function(t){return t.getFullYear()},s=function(t){return t=t.replace("£","").replace(",","").replace("%","").trim(),Number(t)},c=function(t,r,o,s,c,u,d,p,f,m,h){var v="";v+='<div class="row form-group accent1">\t\t\t\t\t<div class="col-xs-12">\t\t\t\t\t\t<h2>By paying &pound;'+s+" per month<br>you'd repay the credit card by "+n(c)+" "+l(c)+"<br>at a cost of &pound;"+e(a(u))+' interest</h2>\t\t\t\t\t</div>\t\t\t\t\t<div class="col-xs-12">\t\t\t\t\t\t<h3>Switch to a balance transfer card <br>and keep the same monthly payments</h3>\t\t\t\t\t\t\t\t\t\t\t\t<div class="p">If you switched to a balance transfer card with a promotional interest rate of 0% for <div class="select-wrapper"><select id="btmonthspromo" class="pseudo-select" onchange="MSMAdsarCreditCardCalculator.recalc()">'+function(t){var e="";for(i=1;i<=99;i++)e+='<option value="'+i+'"',i===t&&(e+=' selected="selected"'),e+=">"+i+"</option>";return e}(d)+'</select></div> months and a one-off fee of <div class="select-wrapper"><select id="btfee" class="pseudo-select" onchange="MSMAdsarCreditCardCalculator.recalc()">'+function(t){var e="";for(i=0;i<=50;i++)e+='<option value="'+i/10+'"',i/10===t&&(e+=' selected="selected"'),e+=">"+i/10+"%</option>";return e}(p)+"</select></div>, ",v+=t<=0?'you would pay the card off by <span class="accentcolour"><span id="paidoffdate">'+n(f)+" "+l(f)+"</span></span> and pay ":'you would be left with <span class="accentcolour">&pound;'+e(t)+"</span> to pay off, paying ",v+='a total of <span class="accentcolour">&pound;<span id="paidoffcost">'+e(a(m+h))+"</span></span> in fees and interest.",r||(v+="*"),v+="</div>"+(y=u,b=m,C=h,y>b+C?'<h2>So, switching could save you <span class="accentcolour">&pound;'+e(a(a(y)-a(b+C)))+"</span></h2>":"")+'\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t\t\t\t\t<div class="row form-group">\t\t\t\t\t<div class="col-xs-12">\t\t\t\t\t\t\t\t\t\t<a href="http://www.moneysupermarket.com/credit-cards/balance-transfer/?goal=CC_ALLCARDS&purpose=AllCards&from=Calc_CardsCalculator&transferAmount='+o+"&monthlyPayment="+s+'" target="_blank" class="btn link" alt="Compare balance transfer cards">Compare balance transfer cards</a>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div class="clearfix"><br></div>';var y,b,C;return r||(v+='<p class="assume">* If you do not pay off your balance within the promotional period, you will then be charged interest. For calculation purposes, we\'ve used the rate you entered above.</p>'),v+="</div>"},u=function(e,r){t("#errorGeneral").hide(),t("#errorTooLong").hide(),t(".error-control").removeClass("error-control"),t(".results").hide();var n=0,i=0,l=0,u=0,d=0,p=0,f=0,m=0,h=0,v=24,y=1.4;""!==e&&y>=0&&!isNaN(e)&&(y=s(e)),""!==r&&r>=0&&!isNaN(r)&&(v=s(r)),n=f=i=s(t("#amount").val()),l=s(t("#interestrate").val()),u=s(t("#repayment").val()),monthlyinterest=function(t){t=1+t/100;return 100*(t=Math.pow(t,1/12)-1)}(l);var b=!1,C=new Array;if((isNaN(n)||n<=0||n>1e5)&&(b=!0,C.push("amount")),(isNaN(l)||l<=0||l>99)&&(b=!0,C.push("interestrate")),(isNaN(u)||u<=0||u>1e4)&&(b=!0,C.push("repayment")),n<=u&&(b=!0,C.push("amount"),C.push("repayment")),b)return g=C,t("#errorGeneral").show(),void t.each(g,function(e,a){t("#"+a).parent().addClass("error-control")});var g;try{var w="";w+="balance:"+n+"|",w+="aer:"+l+"|",w+="repayment:"+u+"|",w+="btfee:"+u+"|",w+="btmonthspromo:"+v+"|",w+="saving:"+a(a(p)-a(h+btfeeamount))+"|",ga("send",{hitType:"event",eventCategory:"Functional Interaction",eventAction:"Calculator Used",eventLabel:"Credit Card Calculator",dimension54:w,metric20:1})}catch(t){}for(;n>0&&d<240;)d++,n>0&&(p+=+n*(monthlyinterest/100)),n*=1+monthlyinterest/100,n-=u;for(paidoff=o(d),btfeeamount=f*(y/100);f>0&&m<v;)m++,f-=u;if(btpaidofffull=!0,f>0)for(btpaidofffull=!1;f>0&&m<240;)m++,f>0&&(h+=+f*(monthlyinterest/100)),f*=1+monthlyinterest/100,f-=u;btpaidoff=o(m),240!==d?(t(".results").html(c(f,btpaidofffull,i,u,paidoff,p,v,y,btpaidoff,h,btfeeamount)),t("#btmonthspromo").val(v),t("#btfee").val(y),t(".results").show(),t("#submit").val("Update My Results"),t(document).scrollTop(t(".results").offset().top-100)):t("#errorTooLong").show()};return{calc:u,recalc:function(){u(t("#btfee").val(),t("#btmonthspromo").val())},infoBlocks:function(){t(".info").click(function(){t("#info-block-"+t(this).attr("data-info")).slideToggle()})},initSlider:function(){var e=document.getElementById("slider");noUiSlider.create(e,{start:0,connect:"lower",range:{min:0,max:1e3},step:5,format:{to:function(t){return 0===t?"":"&pound;"+t},from:function(t){return t.replace("£","")}},tooltips:{to:function(t){return 0===t?"":"&pound;"+t},from:function(t){return t.replace("£","")}}}),e.noUiSlider.on("change",function(e){value=e[0].replace("&pound;",""),value>0?t("#repayment").val(value):t("#repayment").val("")}),repayment=document.getElementById("repayment"),repayment.addEventListener("change",function(){e.noUiSlider.set(this.value),t(".noUi-tooltip").html("&pound;"+this.value)})}}}(jQuery);jQuery(document).ready(function(){MSMAdsarCreditCardCalculator.infoBlocks(),MSMAdsarCreditCardCalculator.initSlider()});