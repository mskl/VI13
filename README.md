# VI13 - ERASMUS+ student flow visualization
> Data visualization class at Instituto Superior de Técnico Lisbon.

> https://mskl.github.io/ist-mi-vi13-erasmus-visualization/

Information visualization project class project developed by [Matyáš Skalický](https://github.com/mskl), [Ingeborg Sollid](https://github.com/isollid) and [Lenka Obermajerová](https://github.com/LenkaObermajerova).

Final report can be viewed [here](misc/checkpoints/report/VI13Report.pdf). The misc repository also contains the checkpoint presentations and reports.

## Try it out online!
The project is accessible at [https://mskl.github.io/ist-mi-vi13-erasmus-visualization/](https://mskl.github.io/ist-mi-vi13-erasmus-visualization/). Note that the goal of the project was not high compatibility neither online usage, so expect the loading to be slow. The final visualization is also not responsive, so it's not useful on mobile devices.

## Running the project offline
The project is fully standalone offline with all of the libraries. The backend server is required for browser to access the files. The app was developed for Chrome at 2880 x 1800, 2560 x 1600 and 1920 x 1080.

To run the application clone the repository, cd into the directory and run the backend server:

``` bash
python -m SimpleHTTPServer 8888
```

The visualization is now accessible at 
http://localhost:8888/.
