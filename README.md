## Data Logger for Formula SAE Race Car

This project is the continuation of the prototype website/view for the formula SAE team at WPI. It focuses on the logging and display of data for the cars performance. The data it gathers is the cars speed, wheel speed (in rotations per minute), current gear, and the date time for the logging. The idea is that the app can accumulate multiple data readings for all gears (Reverse, Park, 1st->6th Gears) and display both the individual records (bottom table) and the aggregate average speed for each gear. All this data is crucial for the engineering team to understand the cars system as it is being developed and to make critical adaptations to the drivetrain system. For a race car, it is important to optimize the speed it goes at each gear and when the gear changes occur (determined by a very high or low wheel rpm). With more advanced calculations, contrasting the wheel speed and car speed data can also inform how much slip there is on the wheels and when, which is an effect that should be minimized through changes accross the car's systems. 

The website uses a Google OAuth system (use your personal google account or email: fsaelogger@gmail.com password: datafsae19!). The website uses cookies and maintains your sessions even if you close your browser(usually if you are using Chrome). The logout functionality is also implemented and it has a button on the main page for it.

The goal of the first table, which shows the average speed per gear, computed on the server after every form entry, is to provide the user (engineering team) with the actual gear speeds. Gear speeds are a car parameter that the team tries to control and predict through design and simulation software but is only ultimately validated with this tool. This table is not editable and will simply be a view of the actual data that is stored in the server.

The goal of the second table is to not only display every reading, but provide an interpreted way of looking at the wheel speed in RPM. Considering the cars maximum rpm is around 1000 rotations per minute, it displays a progress bar towards that number at every reading. The color of the progress bar indicates the need for gear shifting. Red/Orange are closer to the min and max rpms, which represent the need to shift gears down/up respectively. On the other hand, green and blue are on the middle of the spectrum and represent the rpm ranges when the car is at an ideal rpm and gear, with no need to shift. This table can help the design team with understanding shift timing but also the driver, in case it can be read dynamically during driving and after enough data has been inputed. This table shows all the data from the server and is persistent accross different sessions, as it is stored in lowdb. This data is also editable. The user can click in the speed, rpm, or gear fields to change them in any record in this table. Doing so will immediatly be reflected in the server storage as well as the aggregate data table. The user can also delete any rows by double clickling on them and confiming the action in the browser modal that pops up. Likewise, this change is immediately reflected in the other parts of the project. 

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the Google strategy with LogOut included
- **Tech Achievement 2**: Implemented Cookie sessions and CORS package to server/client in order to maintain sessions and users running
- **Tech Achievement 3**: I used ten Express middleware packages, enabling me to create a server that is more professional and efficient, with controllable behaviors on the security/performance aspects.
- **Tech Achievement 4**: Implemented the Bulma css framework alonside tabulator
- **Tech Achievement 5**: Implemented the lowdb module effectively on the data aggregation task

### Design/Evaluation Achievements
- **Design Achievement 1**: I tested my application with several field changes to the existing reading data and in between sessions
- **Design Achievement 2**: I was able to show a unique html page for each user based on their google account, by customizing the welcome greeting
- **Design Achievement 3**: Tested the row delete mechanism multiple times (double click) and had consistent responsiveness
- **Design Achievement 4**: Used varied form input types
- **Design Achievement 5**: Used varied layout and content elements from bulma (hero, sessions, boxes, tiles, fields, control, etc)
