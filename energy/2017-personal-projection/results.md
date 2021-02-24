---
layout: msm/msm-results
permalink: /pds/energy/pp/results/
formdata: /src/assets/msm/data/energy-questions-oct17.json
css: /pds/energypp/assets/style.css
js: /pds/energypp/assets/script.js
---

<link type="text/css" rel="stylesheet" property="stylesheet" href="/sandbox/central-form/style.css">
<link type="text/css" rel="stylesheet" property="stylesheet" href="/pds/energypp/assets/loading.css">

<aside class="loading-panel">
    <header>
        <h1>Loading results</h1>
        <p class="msg userTariffCheapest">Good news. Your current tariff is cheaper than anything on the market.</p>
        <p class="msg userTariffCheapest"><strong>You're unlikely to save by switching now.</strong></p>
        <p class="msg userTariffCheap">It look like your current tariff is one of the cheapest on the market</p>
        <p class="msg userTariffCheap"><strong>However, you might still save money by switching</strong></p>
        <p class="msg userTariffMedium">It looks like you currently pay more than other tariffs would cost.</p>
        <p class="msg userTariffMedium"><strong>You could save by switching, though check for early exit fees</strong></p>
        <p class="msg userTariffVariable">It looks like your on a variable tariff. You are probably paying more than you need to.</p>
        <p class="msg userTariffVariable"><strong>You could save up to &pound;<span class="userSaving">0</span> by switching</strong></p>
        <p class="msg userTariffFixed">It looks like you’re on a fixed deal which ends in the coming months.</p>
        <p class="msg userTariffFixed"><strong>You are likely to save money by switching, though check for early exit fees.</strong></p>
        <div class="chart">
            <p class="legend legend-min"></p>
            <p class="legend legend-max"></p>
        </div>
    </header>
    <footer class="loading-status">
        <h1>Loading</h1>
        <progress max="100" value="0"></progress>
    </footer>
</aside>

<div class="results-header">
    <h1>Great news!</h1>
    <h2>We've got <span class="resultsTotal">50</span> deals we can switch you to quickly &amp; simply today</h2>
    <a class="ppLink">See how your tariff compares to others</a>
    <ul class="tabs resultsTabs">
        <li data-sort-switch="curr">
            <a>Stay with your current supplier</a>
            <small>Save up to £<span class="currCheap">9</span></small>
        </li>
        <li data-sort-switch="big">
            <a>Switch to a big name supplier</a>
            <small>Save up to £<span class="bigCheap">275</span></small>
        </li>
        <li class="active" data-sort-switch="full">
            <a>Choose from our full range</a>
            <small>Save up to £<span class="fullCheap">290</span></small>
        </li>
    </ul>
    <div class="filterLinks">
        <a class="sliderBtn" data-slider="filters">Filter results</a>
        <a class="sliderBtn" data-slider="ppExplain">View your<br />Personal Projection</a>
    </div>
</div>
<ol class="results" id="results">
    <!--Row-->
    <li id="primitive" class="card">
        <ul>
            <li>
                <img>
                <span>
                    <p class="tariffName">Saver Fixed 1 Year v1 Online</p>
                    <h3>Fixed for <span class="promoDuration">12</span> months</h3>
                </span>
            </li>
            <li>
                <dfn>Yearly saving</dfn>
                <p>£<span class="annualSaving">1,424</span></p>
                <a class="sliderBtn" data-slider="compareSlider">How much will I pay?</a>
            </li>
            <li class="ppCell">
                <dfn>Personal projection</dfn>
                <p>£<span class="personalProj">648</span></p>
            </li>
            <li>
                <dfn>Early exit fee</dfn>
                <p>£<span class="exitFee">60</span></p>
            </li>
            <li class="rates">
                <dl>
                    <dt>Unit rate</dt>
                    <dd><span class="gasUnitRate">12.760</span>p per kWh</dd>
                    <dd><span class="elecUnitRate">2.593</span>p per kWh</dd>
                </dl>
                <dl>
                    <dt>Standing charge</dt>
                    <dd>£<span class="gasStdCharge">54.75</span>/yr</dd>
                    <dd>£<span class="elecStdCharge">14.75</span>/yr</dd>
                </dl>
            </li>
            <li>
                <button type="button" class="btn btn__primary">PROCEED</button>
                <a>More details</a>
            </li>
        </ul>
    </li>
</ol>
<aside class="filters slider">
    <a class="close-label close-slider">
        <span>Close</span>
    </a>
    <div class="filter-header">
        <button type="button" class="btn btn__primary close-slider">Update results</button>
    </div>
    <div class="filter-wrap central-form">
        <h1>Filter results</h1>
        <h2>Change your quote using the options below</h2>
        <p>Fuel type</p>
        <div class="form-pseudo-select">
            <select id="">
                <option>Gas &amp; electricity</option>
                <option>Electricity</option>
                <option>Gas</option>
            </select>
        </div>
        <p>Payment type</p>
        <div class="form-pseudo-select">
            <select id="">
                <option>Monthly Direct Debit</option>
                <option>Quarterly Direct Debit</option>
                <option>Quarterly Cash or Cheque</option>
                <option>Prepayment Meter</option>
            </select>
        </div>
        <p>Sort prices by</p>
        <div class="form-pseudo-select">
            <select id="sortFilter">
                <option value="monthly">Monthly saving</option>
                <option selected value="annual">Yearly saving</option>
            </select>
        </div>
        <p>Show savings as</p>
        <ul class="compareRadios">
            <li>
                <input id="comparePP" name="filter-radio" type="radio" value="pp" checked>
                <label for="comparePP">Comparison to my personal projection</label>
            </li>
            <li>
                <input id="compareCurr" name="filter-radio" type="radio" value="curr">
                <label for="compareCurr">Like-for-like comparison to my current plan</label>
            </li>
        </ul>
    </div>
</aside>
<aside class="ppExplain slider">
    <a class="close-label close-slider">
        <span>Close</span>
    </a>
    <h1>Your personal projection is</h1>
    <h2><sub>£</sub><span class="ppCost">XXX.XX</span></h2>
    <small>for the next 12 months</small>
    <div class="ppContrast">
        <h3>What is a personal projection?</h3>
        <p>It's an Ofgem-approved forecast of your energy costs over the next 12 months, assuming you don't switch.  If you're on a cheap plan that ends in the next 12 months, the projection assumes you stay on the same provider's variable tariff - though we suggest you should check if you can switch and save</p>
    </div>
    <h3>12 month projection</h3>
    <p class="remSpend">Based on what you have told us, you're likely to spend another £<span class="ppCost">xxx</span> while on your current tariff.</p>
    <div class="months">
        <b data-text="OCT 2017"></b>
        <b data-text="NOV 2017"></b>
        <b data-text="DEC 2017"></b>
        <b data-text="JAN 2018"></b>
        <b data-text="FEB 2018"></b>
        <b data-text="MAR 2018"></b>
        <b data-text="APR 2018"></b>
        <b data-text="MAY 2018"></b>
        <b data-text="JUN 2018"></b>
        <b data-text="JUL 2018"></b>
        <b data-text="AUG 2018"></b>
        <b data-text="SEP 2018"></b>
    </div>
    <p class="projSpend">Unless you switch you will automatically move to your supplier’s standard variable rate and are projected to pay £<span class="newRemain">xxx</span> for the remainder of the year.</p>
    <div class="ppContrast">
        <p>You can use personal projection to find cheaper deals on the market and figure out the best time to switch.
            <br/><br/>More facts about personal projection:</p>
        <ul class="bullet-list">
            <li>When your current tariff British Gas Online Capped Tariff May 2018 ends you will be automatically moved to British Gas Standard Variable tariff which has variable rates</li>
            <li>Your personal projection is calculated by looking at both of those tariffs and forecasts the combined cost over the next 12 months, assuming you don't switch</li>
            <li>Most Ofgem accredited comparison websites use this personal projection to calculate your savings. You can also choose to see your savings compared to what you pay on your current plan instead</li>
        </ul>
        <a class="close-slider">Close</a>
    </div>
</aside>
<aside class="compareSlider slider" data-compare="pp">
    <a class="close-label close-slider">
        <span>Close</span>
    </a>
    <h1>If you switch to this plan you will pay</h1>
    <h2><sub>£</sub><span class="ppCost">XXX.XX</span></h2>
    <small>per year</small>
    <ul class="tabs">
        <li class="active" data-comparetype="pp">
            <a>Compare to my personal projection</a>
        </li>
        <li data-comparetype="curr">
            <a>Compare to my current plan</a>
        </li>
    </ul>
    <div class="ppContrast comparePPExtra">
        <p>This figure is calculated using Ofgem advice to price comparison websites. This calculation combines your current plan and your supplier’s variable tariff, assuming you don’t switch today.</p>
        <ul class="compareSummary">
            <li>
                <div>
                    <h1>If you DON'T switch</h1>
                    <p>What you'll pay over the next year if you do nothing</p>
                </div>
                <div>
                    <h1>£<span class="userCurrCost">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
            <li>
                <div>
                    <h1>If you DO switch</h1>
                    <p>What you are likely to pay if you switch to this tariff</p>
                </div>
                <div>
                    <h1>£<span class="ppCost">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
            <li>
                <div>
                    <h1>Your saving</h1>
                </div>
                <div>
                    <h1>£<span class="savingCost">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
        </ul>
        <a>View calculation in detail</a>
    </div>
    <div class="ppContrast compareCurrExtra">
        <p>This figure is calculated only on what you are paying now.</p>
        <ul class="compareSummary">
            <li>
                <div>
                    <h1>Your current tariff</h1>
                    <p>This is your current annual bill, based on what you've told us</p>
                </div>
                <div>
                    <h1>£<span class="currAnnual">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
            <li>
                <div>
                    <h1>If you switch</h1>
                    <p>Forecast of your bill over the next year, assuming you use the same amount of energy</p>
                </div>
                <div>
                    <h1>£<span class="ppCost">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
            <li>
                <div>
                    <h1>Your saving</h1>
                </div>
                <div>
                    <h1>£<span class="currSaving">XXX.XX</span></h1>
                    <small>per year</small>
                </div>
            </li>
        </ul>
        <a>View calculation in detail</a>
    </div>
</aside>
<aside class="tariffChart slider">
    <a class="close-label close-slider">
        <span>Close</span>
    </a>
</aside>

<script type="text/javascript" src="/pds/energypp/maths/script.js"></script>