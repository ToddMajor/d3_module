# d3_module
Repository stores code written to plot various forms of data in your browser of choice using Mike Bostock's d3.js v4 library.

V1.0
The point of this project was to replace the flash version of custom made plotting software at work. 
The flash module consisted of options for plotting scatterplots, maps, bar charts, and stacked bar charts. 
Data was pulled into the module using PHP to query the on-site MySQL DBMS. 
One could however use any method of data input (pull from website, load from local excel file as a JSON, etc.).

There is nothing particluarly special about this module, but a few of the design choices were made due to how scatterplots were viewed.
As an example, if we had 5 or more scatterplots (with line paths) signifying multiple IV curves, we would like to plot all of them 
simulataneously and click them on/off by clicking their corresponding legend text. Therefore, you had to have multidimensional arrays
with the first array as the count, then x and y data stored in the inner portion of the multidimensional array. 
Some examples will be given in the repository.
