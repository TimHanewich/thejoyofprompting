## CONTEXT
I work at a State of Texas agency and am leading our effort of setting up a new Legislative Bill Tracking solution that will assist our agency in tracking bills as they progress through legislature. 

I've laid out the technology below I'd like for you to create for me. It is **VERY important** that you make exactly what I've described below - nothing more, nothing less, and exactly as I've described it with the literal names, spellings, etc.

## DATA LAYER
Please create the exact tables described below wit the exact names and columns described as sub-bullets:
- `Bill` Table: represents the bill we are tracking
    - `Number` (Text): the bill number (e.g. HB-320)
    - `Title` (Text): the official short title of the bill
    - `Content` (Text, multi-line): the full bill content
    - `Source` (URL): direct link to the bill
    - `Affected Division` (Text): the name of the division within our agency that is primarily most affected by this bill.
    - `Fiscal Impact?` (Choice): Yes/No if the bill will have fiscal impact to the agency
    - `Summary` (Text): a plain text summary of the bill
- `Bill Update` Table: represents an individual update to the status of a bill as it progresses through legislature.
    - `Related Bill` (lookup to `Bill`)
    - `Updated At` (Date & Time)
    - `Update Type` (Choice): e.g. "Status Change", "Amendment", "Committee Action", "Note"
    - `Description` (Text): plain text description of what happened
- `Bill Commentary` Table: record of internal staff member providing their thoughts on a bill, how it may impact the agency, and how they may be preparing. 
    - `Related Bill` (lookup to `Bill)
    - `Sentiment` (Choice): e.g. "Negative", "Neutral", or "Positive"
    - `Comment` (Text, multi-line): the provided comments

## BILL INPUT & UPDATE APP
- There are a small group of Bill Tracking Specialists within my org that will be responsible for inputting new bills into the system. 
- I'd like to give them a **Power Apps Model-Driven App** for this experience.
- They will create a new bill, enter in all details, and then save it.
- Later, as the bill progresses through legislature, they will also have the ability to log new Bill Update's per each bill.
- They can also review Bill Commentary from the app.

## BILL REVIEW AND COMMENTARY APP
- Division leads across the agency must have an interface for reviewing the bills we are tracking
- For bills that pertain to their division, will also be providing commentary against each bill to track how they are preparing for it.
- Build me a **Power Apps Canvas App** for this expereince.
- In the app, they can see a list of the bills we are tracking (`Bill` table), all bill updates for each bill (`Bill Update` table), and log new commentary against each bill (`Bill Commentary` table).