# height-transition-polyfill
A polyfill to get exact height transitions from zero to auto, when already using the max-height workaround

This gets rid of delays due to mismatch between max-height and actual height.

See this answer for more information: https://stackoverflow.com/a/8331169/6691

E.g. the following:

    <div id="menu">
        <a>hover me</a>
        <ul id="list">
            <!-- Create a bunch, or not a bunch, of li's to see the timing. -->
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
        </ul>
    </div>

    #menu #list {
        max-height: 0;
        transition: max-height 0.15s ease-out;
        overflow: hidden;
        background: #d5d5d5;
    }

    #menu:hover #list {
        max-height: 500px;
        transition: max-height 0.25s ease-in;
    }

Can have `max-height: 10000000px` to accommodate unknown content, and the transition will be converted on the fly to a `height` transition, starting from the current height of the DOM element.

The script relies on an injected CSS rule `[height-locked] { height: 0 !important;}`.  For transitions down to non-zero heights, this rule will have to be manually overridden, e.g.

    div.when-small {
        max-height: 2em;
        transition: max-height 0.15s ease-out;
    }

    div:not(.when-small) {
        max-height: 30em;
        transition: max-height 0.25s ease-in;
    }

    div.when-small[height-locked] {
        height: 2em !important;
    }