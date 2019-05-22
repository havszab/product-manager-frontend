Product manager app

This is my PET project's frontend repo, currently isn't deployed, and as it's still under developement the content I wrote below, may represent a former version of the project.

Install dependencied via npm install and run using npm, too.

Main libraries I used: React, ant design, react chart js 2 and I developed in typescript instead of javascript.

Features (2019.05.22)

You can start an acquisition, where different kind of products and its quantities, prices, unit types can be added to the current acquisition. This helps the trader to manage the products while acquiring them. Sometimes the same type of product is from multiple different sources, eg. apple can be bought from different traders, in this case the product type should be handled consequently, to keep them comparable, thats one of the reasons why product categories are introduced. Once they are creted, they will be offered by the cascader. When the acquisition is finished, they can be moved to stock by finishing the acquisition. This changes their status to: IN_STOCK automatically.

![alt text](https://user-images.githubusercontent.com/37657273/58175682-fd6e8100-7ca0-11e9-9408-5c754bd6e037.png)

Products which aren't sold yet are listed in the stock menu. That's the place where they can be sold. The form has 2 input fields: a slider which sets the quantity we want to sell, and a simple number input to enter the price we want to receive for the offered quantity. On the modal we can see some important details which helps us to calculate a price and see other relevant informations about the sale. These details are updated on every input change. After selling an item the remaining quantity is still in the stock menu, but the sold quantity will appear in the sales menu option.

Listed stock items:

![alt text](https://user-images.githubusercontent.com/37657273/58175865-62c27200-7ca1-11e9-9bbc-4d13b5a2256c.png)

Selling form:

![alt text](https://user-images.githubusercontent.com/37657273/58175974-a0bf9600-7ca1-11e9-88bd-4f09eb5e34ba.png)

Invoice: select registered buyer
![alt text](https://user-images.githubusercontent.com/37657273/58175915-7a99f600-7ca1-11e9-82f3-cd6ade0ae3e9.png)

Invoice: filled with items
![alt text](https://user-images.githubusercontent.com/37657273/58176124-e5e3c800-7ca1-11e9-9f0e-e6d8ae2ec1e2.png)


Under the sales menu we can examine the recently sold products and their sale details.

![alt text](https://user-images.githubusercontent.com/37657273/58176233-293e3680-7ca2-11e9-8dae-c13a5b24525b.png)

Monthly view: 
![alt text](https://user-images.githubusercontent.com/37657273/58176279-3d823380-7ca2-11e9-888f-8fdf23b8c276.png)

Invoices
![alt text](https://user-images.githubusercontent.com/37657273/58176369-6acee180-7ca2-11e9-8ed6-2d994acc44b2.png)

Invoice preview
![alt text](https://user-images.githubusercontent.com/37657273/58176410-7e7a4800-7ca2-11e9-912c-ed4de5610f98.png)

![alt text]()

Dashbord menu provides the opportunity to watch some visuailed statistics and here can be seen the recent actions too. Actions are: finishing an acquisition (blue), selling a product (green), pay some costs [rents, taxes] (red).

Dashboard overview
![alt text](https://user-images.githubusercontent.com/37657273/58176487-a9649c00-7ca2-11e9-98cc-6416cb44fe28.png)
![alt text](https://user-images.githubusercontent.com/37657273/58176508-b84b4e80-7ca2-11e9-9d76-22d0ddc328fe.png)

Dashboard monthly view
![alt text](https://user-images.githubusercontent.com/37657273/58176562-d44ef000-7ca2-11e9-99b9-b118a65424ce.png)

Dashboard annual view
![alt text](https://user-images.githubusercontent.com/37657273/58176615-f0529180-7ca2-11e9-93d9-903f401b105a.png)
![alt text](https://user-images.githubusercontent.com/37657273/58176624-f7799f80-7ca2-11e9-85ad-516e94b3b1c1.png)

![alt text]()
![alt text]()
![alt text]()
