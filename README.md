Product manager app

This is my PET project's frontend repo, currently isn't deployed, and as it's still under developement the content I wrote below, may represent a former version of the project.

Install dependencied via npm install and run using npm, too.

Main libraries I used: React, ant design, react chart js 2 and I developed in typescript instead of javascript.

Features (2019.04.18)

You can start an acquisition, where different kind of products and its quantities, prices, unit types can be added to the current acquisition. This helps the trader to manage the products while acquiring them. Sometimes the same type of product is from multiple different sources, eg. apple can be bought from different traders, in this case the product type should be handled consequently, to keep them comparable, thats one of the reasons why product categories are introduced. Once they are creted, they will be offered by the cascader. When the acquisition is finished, they can be moved to stock by finishing the acquisition. This changes their status to: IN_STOCK automatically.

![alt text](https://user-images.githubusercontent.com/37657273/56344602-18d7ff00-61be-11e9-806d-4fd43a483c1e.png)

Products which aren't sold yet are listed in the stock menu. That's the place where they can be sold. The form has 2 input fields: a slider which sets the quantity we want to sell, and a simple number input to enter the price we want to receive for the offered quantity. On the modal we can see some important details which helps us to calculate a price and see other relevant informations about the sale. These details are updated on every input change. After selling an item the remaining quantity is still in the stock menu, but the sold quantity will appear in the sales menu option.

Listed stock items:

![alt text](https://user-images.githubusercontent.com/37657273/56344662-415ff900-61be-11e9-9944-9079479dae6e.png)

Selling form:

![alt text](https://user-images.githubusercontent.com/37657273/56344709-5e94c780-61be-11e9-9986-8857b5a6792b.png)

Under the sales menu we can examine the recently sold products and their sale details.

![alt text](https://user-images.githubusercontent.com/37657273/56344745-7c622c80-61be-11e9-8d5a-da340c001d14.png)

Dashbord menu provides the opportunity to watch some visuailed statistics and here can be seen the recent actions too. Actions are: finishing an acquisition (blue), selling a product (green), pay some costs [rents, taxes] (red).

![alt text](https://user-images.githubusercontent.com/37657273/56344855-b3d0d900-61be-11e9-8077-16b0eb5061e4.png)
