// Pops open any document referenced by a [data-doc] button, w/ copy-to-clipboard.

(function ()
{
    var viewer = document.getElementById("viewer");
    var pane = viewer.querySelector(".viewer-pane");
    var titleEl = document.getElementById("viewer-title");
    var bodyEl = document.getElementById("viewer-body");
    var copyBtn = document.getElementById("viewer-copy");
    var closeBtn = document.getElementById("viewer-close");
    var lastFocused = null;
    var contents = "";

    function open(url, title)
    {
        lastFocused = document.activeElement;
        titleEl.textContent = title || "Document";
        bodyEl.textContent = "Loading\u2026";
        contents = "";
        copyBtn.disabled = true;
        copyBtn.textContent = "Copy to Clipboard";
        viewer.hidden = false;
        document.body.classList.add("no-scroll");
        bodyEl.focus();

        fetch(url, { cache: "no-store" })
            .then(function (res)
            {
                if (!res.ok) { throw new Error(res.status + " " + res.statusText); }
                return res.text();
            })
            .then(function (text)
            {
                contents = text;
                bodyEl.textContent = text;
                bodyEl.scrollTop = 0;
                copyBtn.disabled = false;
            })
            .catch(function (err)
            {
                bodyEl.textContent = "Could not load this document (" + err.message + ").";
            });
    }

    function close()
    {
        viewer.hidden = true;
        document.body.classList.remove("no-scroll");
        if (lastFocused) { lastFocused.focus(); }
    }

    function flash(message)
    {
        copyBtn.textContent = message;
        setTimeout(function () { copyBtn.textContent = "Copy to Clipboard"; }, 2000);
    }

    function legacyCopy()
    {
        var scratch = document.createElement("textarea");
        scratch.value = contents;
        scratch.setAttribute("readonly", "");
        scratch.style.position = "fixed";
        scratch.style.opacity = "0";
        document.body.appendChild(scratch);
        scratch.select();

        var worked = false;
        try { worked = document.execCommand("copy"); } catch (e) { worked = false; }

        document.body.removeChild(scratch);
        flash(worked ? "Copied!" : "Press Ctrl+C to copy");
    }

    function copy()
    {
        if (!contents) { return; }

        if (navigator.clipboard && window.isSecureContext)
        {
            navigator.clipboard.writeText(contents)
                .then(function () { flash("Copied!"); })
                .catch(function () { legacyCopy(); });
        }
        else
        {
            legacyCopy();
        }
    }

    document.querySelectorAll("[data-doc]").forEach(function (btn)
    {
        btn.addEventListener("click", function ()
        {
            open(btn.getAttribute("data-doc"), btn.getAttribute("data-doc-title"));
        });
    });

    copyBtn.addEventListener("click", copy);
    closeBtn.addEventListener("click", close);

    viewer.addEventListener("click", function (e)
    {
        if (!pane.contains(e.target)) { close(); }
    });

    document.addEventListener("keydown", function (e)
    {
        if (e.key === "Escape" && !viewer.hidden) { close(); }
    });
}());
