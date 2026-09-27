// Builds the sample bill buttons under "Our Supplies" from assets/bills.json.

(function ()
{
    var holder = document.getElementById("bill-buttons");
    if (!holder) { return; }

    function show(bill, index)
    {
        var fields = [
            { label: "Bill Number", value: bill.billNumber },
            { label: "Title", value: bill.title },
            { label: "Affected Division", value: bill.affectedAgency },
            { label: "Fiscal Impact", value: bill.fiscalImpact ? "Yes" : "No" }
        ];

        if (bill.source)
        {
            fields.push({ label: "Source", value: bill.source, href: bill.source });
        }

        window.DocViewer.openText("Sample Bill #" + index + ": " + bill.billNumber, bill.content, fields);
    }

    fetch("./assets/bills.json", { cache: "no-store" })
        .then(function (res)
        {
            if (!res.ok) { throw new Error(res.status + " " + res.statusText); }
            return res.json();
        })
        .then(function (bills)
        {
            holder.innerHTML = "";

            bills.forEach(function (bill, i)
            {
                var btn = document.createElement("button");
                btn.className = "button small";
                btn.textContent = "Sample Bill #" + (i + 1);
                btn.title = bill.billNumber + ": " + bill.title;
                btn.addEventListener("click", function () { show(bill, i + 1); });
                holder.appendChild(btn);
            });
        })
        .catch(function (err)
        {
            holder.innerHTML = "";
            var msg = document.createElement("span");
            msg.className = "bill-status";
            msg.textContent = "Could not load the sample bills (" + err.message + ").";
            holder.appendChild(msg);
        });
}());
