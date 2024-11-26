### **Interaction Between Median, OSM, and DSValue**

1. **Price Aggregation (Median)**:
    
    - Whitelisted oracles provide price feeds to the Median.
    - The Median calculates the median price and stores it as the reference value.
2. **Time Delay (OSM)**:
    
    - The OSM periodically fetches the price from the Median and delays its exposure by a predefined time interval.
    - The delayed price is used in the Maker Protocol for risk mitigation.
1. **Flexible Access (DSValue)**:
    
    - The DSValue contract can fetch the price from the Median or OSM and store it for other consumers.
    - It may be used in setups where the time delay of the OSM is unnecessary, or direct access to the price is required.