// js/data.js
(() => {
    const IMG = "img/test.png";
    const PIZ = "Pizza", BUR = "Burger", PAS = "Pasta", SAL = "Salad";
    const Mlk = "Milk", Glt = "Gluten", Ses = "Sesame", Fsh = "Fish", Egg = "Egg", Nut = "Nuts";

    const d = (id, name, price, category, ingredients, allergens, desc) => ({
        id, name, price, category, image: IMG, ingredients, allergens: allergens || [], description: desc
    });

    window.DISHES = [
        d(1, "Margherita Pizza", 85, PIZ, ["Tomato","Mozzarella","Basil"], [Mlk, Glt], "Klassisk pizza med tomat, mozzarella og frisk basilikum."),
        d(2, "Chicken Shawarma", 95, BUR, ["Chicken","Garlic","Tahini","Pickles"], [Ses], "Saftig kylling med hvidløgssauce og syltede grøntsager."),
        d(3, "Pasta Bolognese", 99, PAS, ["Beef","Tomato","Onion","Garlic"], [Glt], "Hjemmelavet bolognese med frisk pasta."),
        d(4, "Caesar Salad", 79, SAL, ["Lettuce","Chicken","Croutons","Parmesan"], [Mlk, Glt], "Sprød salat med kylling og parmesan."),
        d(5, "Supreme Pizza", 110, PIZ, ["Tomato","Cheese","Pepperoni","Peppers"], [Mlk, Glt], "Fyldt pizza med masser af toppings."),
        d(6, "Veggie Bowl", 89, SAL, ["Quinoa","Avocado","Chickpeas","Veggies"], [], "Frisk skål med grønt og protein."),
        d(7, "BBQ Chicken Pizza", 105, PIZ, ["Chicken","BBQ","Onion","Mozzarella"], [Mlk, Glt], "Røget BBQ med kylling og ost."),
        d(8, "Tuna Salad", 82, SAL, ["Tuna","Lettuce","Corn","Olives"], [Fsh], "Frisk salat med tun og majs."),
        d(9, "Penne Alfredo", 99, PAS, ["Cream","Parmesan","Garlic"], [Mlk, Glt], "Cremet parmesan-sauce med hvidløg."),
        d(10, "Pepperoni Pizza", 98, PIZ, ["Tomato","Mozzarella","Pepperoni"], [Mlk, Glt], "Klassisk pepperoni med ekstra ost."),
        d(11, "Chicken Burger", 96, BUR, ["Chicken","Lettuce","Tomato","Cheese"], [Mlk, Glt, Ses], "Sprød kyllingeburger med ost."),
        d(12, "Spaghetti Carbonara", 102, PAS, ["Egg","Pancetta","Parmesan","Pepper"], [Egg, Mlk, Glt], "Italiensk klassiker med æg og parmesan."),
        d(13, "Four Cheese Pizza", 112, PIZ, ["Mozzarella","Parmesan","Gorgonzola","Cheddar"], [Mlk, Glt], "Fire oste for maksimal smag."),
        d(14, "Double Cheese Burger", 109, BUR, ["Beef","Cheese","Onion","Pickles"], [Mlk, Glt, Ses], "Dobbel ost og saftig bøf."),
        d(15, "Pesto Pasta", 94, PAS, ["Basil","Parmesan","Pine nuts","Olive oil"], [Mlk, Glt, Nut], "Frisk pesto med parmesan og pinjekerner."),
        d(16, "Veggie Pizza", 92, PIZ, ["Tomato","Mozzarella","Peppers","Olives","Onion"], [Mlk, Glt], "Grøntsager i farver med ost."),
        d(17, "Falafel Burger", 88, BUR, ["Falafel","Tahini","Lettuce","Tomato"], [Ses, Glt], "Vegetarisk burger med tahini."),
        d(18, "Lasagna", 115, PAS, ["Beef","Tomato","Béchamel","Pasta sheets"], [Mlk, Glt], "Lag-på-lag ovnbagt pasta."),
        d(19, "Greek Salad", 84, SAL, ["Tomato","Cucumber","Feta","Olives","Onion"], [Mlk], "Klassisk græsk salat med feta."),
        d(20, "Chicken Quinoa Salad", 95, SAL, ["Quinoa","Chicken","Avocado","Spinach"], [], "Proteinrig salat med kylling og quinoa."),
        d(21, "Fish Burger", 101, BUR, ["Cod","Tartar sauce","Lettuce","Pickles"], [Fsh, Glt, Egg], "Sprød fiskeburger med tartarsauce.")
    ];
})();
