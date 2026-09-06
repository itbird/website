Imagine handing someone a note that says **“12°C.”** Then ask them whether a shipment needs attention.

A useful response would start with questions. When was it measured? Where? What was being transported? Was the reading unusual for this process?

The same thought experiment is a useful way to approach AI.

## Give the evidence a shape

For an illustrative shipment record, I would want to distinguish:

| Part of the record | What it helps us ask |
| --- | --- |
| Observation | What was actually measured? |
| Time | When did it happen, and for how long? |
| Context | Which sensor, shipment and process stage? |
| Source | Where can someone check the original evidence? |
| Unknowns | What information is still missing? |

This is a proposed way to organise an explanation, not a claim that these fields alone make a system reliable.

## Separate three kinds of statement

**Observed:** a sensor recorded a value at a particular time.

**Inferred:** an interpretation suggests what might explain it.

**Still unknown:** the record cannot settle a question.

An explanation becomes easier to inspect when those statements are visibly different. A fluent paragraph should not make a missing measurement disappear.

## A useful experiment before a clever model

Try [Between the readings](/#experiments). The temperature spike is part of the simulated history, but some sampling schedules miss it entirely.

That leaves a question to take into any AI project: **does the available evidence contain what we are asking the system to explain?**

For a real research starting point, the [Time-Temperature Dataset for the Strawberry Cold Chain Across Multiple Shipments and Locations](https://arxiv.org/abs/2103.12895) describes temperature data collected across a strawberry supply chain. It is a reading lead, not a dataset used by this website’s fictional experiments.
