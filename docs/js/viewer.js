// Pops open any document referenced by a [data-doc] button, w/ copy-to-clipboard.

(function ()
{
    var viewer = document.getElementById("viewer");
    var pane = viewer.querySelector(".viewer-pane");
    var titleEl = document.getElementById("viewer-title");
    var bodyEl = document.getElementById("viewer-body");
    var metaEl = document.getElementById("viewer-meta");
    var imageWrap = document.getElementById("viewer-image");
    var imageEl = document.getElementById("viewer-image-src");
    var copyBtn = document.getElementById("viewer-copy");
    var closeBtn = document.getElementById("viewer-close");
    var lastFocused = null;
    var contents = "";
    var defaultCopyLabel = "Copy to Clipboard";

    function open(url, title)
    {
        prepare(title);
        setMeta(null);
        bodyEl.textContent = "Loading\u2026";

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

    function openText(title, text, fields)
    {
        prepare(title);
        setMeta(fields);
        contents = text;
        bodyEl.textContent = text;
        bodyEl.scrollTop = 0;
        copyBtn.disabled = false;
    }

    function openImage(title, url)
    {
        prepare(title, "Copy Image URL");
        setMeta([{ label: "Image URL", value: url, href: url }]);
        bodyEl.hidden = true;
        imageWrap.hidden = false;
        imageEl.src = url;
        imageEl.alt = title || "";
        contents = url;
        copyBtn.disabled = false;
    }

    function setMeta(fields)
    {
        metaEl.innerHTML = "";

        if (!fields || !fields.length)
        {
            metaEl.hidden = true;
            return;
        }

        fields.forEach(function (field)
        {
            var dt = document.createElement("dt");
            dt.textContent = field.label;
            metaEl.appendChild(dt);

            var dd = document.createElement("dd");

            if (field.href)
            {
                var link = document.createElement("a");
                link.href = field.href;
                link.target = "_blank";
                link.rel = "noopener";
                link.textContent = field.value;
                dd.appendChild(link);
            }
            else
            {
                dd.textContent = field.value;
            }

            metaEl.appendChild(dd);
        });

        metaEl.hidden = false;
    }

    function prepare(title, copyLabel)
    {
        lastFocused = document.activeElement;
        titleEl.textContent = title || "Document";
        contents = "";
        defaultCopyLabel = copyLabel || "Copy to Clipboard";
        copyBtn.disabled = true;
        copyBtn.textContent = defaultCopyLabel;
        imageWrap.hidden = true;
        imageEl.removeAttribute("src");
        bodyEl.hidden = false;
        viewer.hidden = false;
        document.body.classList.add("no-scroll");
        bodyEl.focus();
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
        setTimeout(function () { copyBtn.textContent = defaultCopyLabel; }, 2000);
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

    document.querySelectorAll("[data-img]").forEach(function (btn)
    {
        btn.addEventListener("click", function ()
        {
            openImage(btn.getAttribute("data-img-title"), btn.getAttribute("data-img"));
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

    window.DocViewer = { open: open, openText: openText, openImage: openImage };
}());
