import { NextResponse } from 'next/server'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

interface Product {
  name: string
  quantity: number
}

const cache = {
  "leche": {
    "timestamp": "2025-07-06T08:50:45.185Z",
    "data": {
      "products": [
        {
          "title": "Leche Parcialmente Descremada DIA Sachet 1 Lt.",
          "price": "$1190.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/leche-parcialmente-descremada-dia-sachet-1-lt-30112/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/343873/Leche-Parcialmente-Descremada-DIA-Sachet-1-Lt-_1.jpg?v=638736548318930000"
        },
        {
          "title": "Leche Ultrapasteurizada 2% Dia 1 Lt.",
          "price": "$1190.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/leche-ultrapasteurizada-2--dia-1-lt-269231/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/344153/Leche-Ultrapasteurizada-2--Dia-1-Lt-_1.jpg?v=638736551498170000"
        },
        {
          "title": "Leche Entera DIA Sachet 1 Lt.",
          "price": "$1190.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/leche-entera-dia-sachet-1-lt-30111/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/343871/Leche-Entera-DIA-Sachet-1-Lt-_1.jpg?v=638736548287370000"
        },
        {
          "title": "Leche UAT entera Carrefour classic brik 1 lt.",
          "price": "$1278.80",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/leche-uat-entera-carrefour-classic-brik-1-lt-720022/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/386693/7791720029404_01.jpg?v=638318705567600000"
        },
        {
          "title": "Leche Infantil Líquida Nan 3 x 24 un",
          "price": "$30871.00",
          "store": "disco",
          "link": "https://www.farmacity.com/leche-infantil-liquida-nan-3-x-24-un/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/232585/214031_leche-infantil-liquida-nan-3-x-24-un_imagen-1.jpg?v=638055240592170000"
        },
        {
          "title": "Leche Entera Check Larga Vida 1 L",
          "price": "$1389.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/leche-uht-entera-check-1-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/355416/Leche-Entera-Check-Larga-Vida-1-L-0779912000102-1.jpg?v=638841438251530000"
        },
        {
          "title": "Leche Descremada Check Larga Vida 1 L",
          "price": "$1389.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/leche-uht-parcialmente-descremada-check-1-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/315951/Leche-Uat-Check-Parcialmente-Descremada-Larga-Vida-1-L-1-32618.jpg?v=638436405919200000"
        },
        {
          "title": "Leche Semi Descremada DIA Larga Vida 1 Lt.",
          "price": "$1390.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/leche-semi-descremada-dia-larga-vida-1-lt-504/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/346318/Leche-Semi-Descremada-DIA-Larga-Vida-1-Lt-_1.jpg?v=638768905078330000"
        },
        {
          "title": "Leche Desc Ls Reduc. Lactosa Sachet 1l",
          "price": "$1950.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/leche-desc-ls-reduc-lactosa-sachet-1l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853917/Leche-Desc-Ls-Reduc-Lactosa-Sachet-1l-Leche-Desc-Ls-Zero-Lactosa-Sachet-1l-1-886202.jpg?v=638733299923930000"
        },
        {
          "title": "Leche Desc Ls Reduc. Lactosa Sachet 1l",
          "price": "$1950.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/leche-desc-ls-reduc-lactosa-sachet-1l/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/853917/Leche-Desc-Ls-Reduc-Lactosa-Sachet-1l-Leche-Desc-Ls-Zero-Lactosa-Sachet-1l-1-886202.jpg?v=638733299923930000"
        },
        {
          "title": "Leche Descremada La Serenísima 1sachet 1lt",
          "price": "$2000.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/leche-descremada-la-serenisima-1sachet-1lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853882/Leche-Descremada-La-Seren-sima-1sachet-1lt-1-849813.jpg?v=638733299806900000"
        },
        {
          "title": "Leche Uat Descremada Las Tres Niñas 1l",
          "price": "$2230.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/leche-uat-descremada-las-tres-ninas-1l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/818747/Leche-Uat-Descremada-Las-Tres-Ni-as-1-L-1-668224.jpg?v=638488787475130000"
        },
        {
          "title": "Leche La serenisima clásica 3% 1L.",
          "price": "$2299.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/leche-la-serenisima-clasica-3-1l-720719/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/636141/7790742363008_01.jpg.jpg?v=638780812788100000"
        },
        {
          "title": "Leche La serenisima liviana 1% 1L",
          "price": "$2299.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/leche-la-serenisima-liviana-1-1l-720720/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/636143/7790742363107_01.jpg.jpg?v=638780813024830000"
        },
        {
          "title": "Leche Descremada La Serenísima Larga Vida Livana 1 L",
          "price": "$2299.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/leche-la-serenisima-larga-vida-livana-1-l-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/283922/Leche-La-Serenisima-Larga-Vida-Livana-1-L-1-43470.jpg?v=638736071630270000"
        },
        {
          "title": "Leche Descremada La Serenísima Larga Vida Zero Lactosa 1 L",
          "price": "$2469.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/leche-larga-vida-la-serenisima-zero-lactosa-1-l-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/306415/Leche-Larga-Vida-La-Seren-sima-Zero-Lactosa-1-L-1-50524.jpg?v=638736088016900000"
        },
        {
          "title": "Leche descremada larga vida La Serenísima cero lactosa 1 l.",
          "price": "$2469.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/leche-descremada-larga-vida-la-serenisima-cero-lactosa-1-l/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/636105/7790742333605_01.jpg.jpg?v=638780808656800000"
        },
        {
          "title": "Leche Uat La Serenisima 1 - 1 Lt",
          "price": "$2650.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/leche-uat-la-serenisima-1-1-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853940/Leche-Uat-La-Serenisima-1-1-Lt-1-958306.jpg?v=638733299996700000"
        },
        {
          "title": "Leche Uat La Serenisima 1 - 1 Lt",
          "price": "$2650.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/leche-uat-la-serenisima-1-1-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853940/Leche-Uat-La-Serenisima-1-1-Lt-1-958306.jpg?v=638733299996700000"
        },
        {
          "title": "Leche La Serenisima Liviana Bot 1l",
          "price": "$2750.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/leche-la-serenisima-liviana-bot-1l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853868/Leche-La-Serenisima-Liviana-Bot-1l-1-807015.jpg?v=638733298554830000"
        },
        {
          "title": "Leche La Serenisima Zerolact Bot 1l",
          "price": "$2800.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/leche-la-serenisima-zerolact-bot-1l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000"
        },
        {
          "title": "Leche La Serenisima Zerolact Bot 1l",
          "price": "$2800.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/leche-la-serenisima-zerolact-bot-1l/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000"
        },
        {
          "title": "Leche La Serenisima Zerolact Bot 1l",
          "price": "$2800.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/leche-la-serenisima-zerolact-bot-1l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/853869/Leche-La-Serenisima-Zerolact-Bot-1l-Leche-Zero-Lactosa-La-Serenisima-Botella-Larga-Vida-1l-1-833488.jpg?v=638733298558370000"
        },
        {
          "title": "Galletitas Leche Con Dulce De Leche Okebon 273 Gr",
          "price": "$1450.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/galletitas-leche-con-dulce-de-leche-okebon-273-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/586776/Galletitas-Okebon-Leche-Con-Dulce-De-Leche-290-Gr-1-2145.jpg?v=637269240267330000"
        },
        {
          "title": "Dulce De Leche Ser 300g",
          "price": "$2950.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/dulce-de-leche-ser-300g/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/618234/Dulce-De-Leche-Ser-300g-1-855295.jpg?v=637447656298500000"
        },
        {
          "title": "Leche Infantil en Polvo Nutrilon 4 Pouch x 1,2 kg",
          "price": "$27173.00",
          "store": "disco",
          "link": "https://www.farmacity.com/leche-infantil-en-polvo-nutrilon-4-pouch-x-1-2-kg/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/246009/217819_leche-infantil-en-polvo-nutrilon-4-pouch-x-12-kg__imagen-1.jpg?v=638283964243730000"
        },
        {
          "title": "Leche Infantil en Polvo Nutrilon 3 Pouch x 1,2 kg",
          "price": "$28892.00",
          "store": "disco",
          "link": "https://www.farmacity.com/leche-infantil-en-polvo-nutrilon-3-pouch-x-1-2-kg/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/246006/217821_leche-infantil-en-polvo-nutrilon-3-pouch-x-12-kg__imagen-1.jpg?v=638283955042430000"
        },
        {
          "title": "Oblea Leche 4 Fingers 41.5 Grs Kitkat®",
          "price": "$2100.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/oblea-leche-4-fingers-41-5-grs-kitkat/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/875490/Oblea-Leche-4-Fingers-Kitkat-41-5-Gr-1-238654.jpg?v=638872403612770000"
        },
        {
          "title": "Chocolate Con Leche Milka 150 Gr",
          "price": "$9200.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/chocolate-con-leche-milka-150-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/803254/Chocolate-Con-Leche-Milka-150g-1-26505.jpg?v=638379382566430000"
        },
        {
          "title": "Leche de Limpieza Facial Filomena Clean Beauty x 60 ml",
          "price": "$11500.00",
          "store": "disco",
          "link": "https://www.farmacity.com/leche-de-limpieza-filomena-clean-beauty-x-60-ml/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/243037/233786_leche-de-limpieza-filomena-clean-beauty-x-60-ml_imagen-1.jpg?v=638210697694500000"
        }
      ],
      "totalFound": 30
    }
  },
  "coca cola": {
    "timestamp": "2025-07-06T13:16:25.752Z",
    "data": {
      "products": [
        {
          "title": "Gaseosa cola Coca Cola zero pet 1,5 lts",
          "price": "$2790.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/gaseosa-cola-coca-cola-zero-pet-15-lts-390893/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/544887/7790895067556_E01.jpg?v=638576047552600000"
        },
        {
          "title": "Gaseosa cola Coca Cola light 1,5 lts",
          "price": "$2790.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/gaseosa-cola-coca-cola-light-15-lts-31006/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/275261/7790895001451_E01.jpg?v=638126760565730000"
        },
        {
          "title": "Gaseosa cola Coca Cola Zero 2,25 lts",
          "price": "$4209.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/gaseosa-cola-coca-cola-zero-225-lts-393964/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/395283/7790895067570_E01.jpg?v=638326494223030000"
        },
        {
          "title": "Gaseosa Coca Cola Sabor Original Menos Azúcares 2,25 L",
          "price": "$4399.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/gaseosa-coca-cola-sabor-original-2-25-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/287194/077908950009901-27756.jpg?v=638229801861200000"
        },
        {
          "title": "Gaseosa Coca Cola Zero 2.25 L",
          "price": "$4399.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/gaseosa-coca-cola-sin-azucar-2-25-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/287327/Gaseosa-Coca-Cola-Zero-2-25-L-Gaseosa-Coca-Cola-Sin-Az-car-2-25l-1-27779.jpg?v=638229910190070000"
        },
        {
          "title": "Coca-cola Zero 2,25 Lt",
          "price": "$4400.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/coca-cola-zero-2-25-lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/799920/Gaseosa-Coca-Cola-Sin-Azucar-2-25lt-1-19721.jpg?v=638349573899270000"
        },
        {
          "title": "Gaseosa Coca-Cola Sabor Original 2.25 Lt.",
          "price": "$4400.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/gaseosa-coca-cola-sabor-original-225-lt-14837/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/307376/Gaseosa-CocaCola-Sabor-Original-2-25-Lt-_1.jpg?v=638599329582770000"
        },
        {
          "title": "Gaseosa Coca-cola Sabor Original 2.25 L",
          "price": "$4400.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/gaseosa-coca-cola-sabor-original-2-25-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/783070/Gaseosa-Coca-cola-Sabor-Original-2-25-L-1-247191.jpg?v=638206690815300000"
        },
        {
          "title": "Coca-cola Zero 2,25 Lt",
          "price": "$4400.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/coca-cola-zero-2-25-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/799920/Gaseosa-Coca-Cola-Sin-Azucar-2-25lt-1-19721.jpg?v=638349573899270000"
        },
        {
          "title": "Gaseosa cola Coca Cola sabor original 2,25 lts",
          "price": "$4400.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/gaseosa-cola-coca-cola-sabor-original-225-lts-30138/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/332148/7790895000997_E01.jpg?v=638211437412370000"
        },
        {
          "title": "Gaseosa Coca-Cola Zero 2.25 Lt.",
          "price": "$4400.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/gaseosa-coca-cola-zero-225-lt-121537/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/311435/Gaseosa-CocaCola-Zero-2-25-Lt-_1.jpg?v=638599386528430000"
        },
        {
          "title": "Gaseosa Coca-cola Sabor Original 2.25 L",
          "price": "$4400.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/gaseosa-coca-cola-sabor-original-2-25-l/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/783070/Gaseosa-Coca-cola-Sabor-Original-2-25-L-1-247191.jpg?v=638206690815300000"
        },
        {
          "title": "Coca Cola Zero 1,25 Lt.",
          "price": "$2445.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/coca-cola-zero-125-lt-260615/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/341632/Coca-Cola-Zero-125-Lt-_1.jpg?v=638708908193700000"
        },
        {
          "title": "Gaseosa Coca-Cola Sabor Original 1,25 Lt.",
          "price": "$2445.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/gaseosa-coca-cola-sabor-original-125-lt-251157/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/339921/Gaseosa-CocaCola-Sabor-Original-125-Lt-_1.jpg?v=638689890094830000"
        },
        {
          "title": "Gaseosa Coca-cola Sabor Original 2.25 L",
          "price": "$4532.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/gaseosa-coca-cola-sabor-original-2-25-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/783070/Gaseosa-Coca-cola-Sabor-Original-2-25-L-1-247191.jpg?v=638206690815300000"
        },
        {
          "title": "Coca-cola Zero 2,25 Lt",
          "price": "$4532.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/coca-cola-zero-2-25-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/799920/Gaseosa-Coca-Cola-Sin-Azucar-2-25lt-1-19721.jpg?v=638349573899270000"
        },
        {
          "title": "Gaseosa Coca Cola Zero 1.75lt",
          "price": "$3650.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/gaseosa-coca-cola-zero-1-75lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/799927/Gaseosa-Coca-Cola-Zero-1-75lt-1-367450.jpg?v=638349573931070000"
        },
        {
          "title": "Gaseosa Coca Cola Zero 1.75lt",
          "price": "$3650.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/gaseosa-coca-cola-zero-1-75lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/799927/Gaseosa-Coca-Cola-Zero-1-75lt-1-367450.jpg?v=638349573931070000"
        },
        {
          "title": "Gaseosa Coca-cola Sabor Original 1,75 Lt",
          "price": "$3650.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/gaseosa-coca-cola-sabor-original-1-75-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/783089/Gaseosa-Coca-cola-Sabor-Original-1-75-Lt-1-254543.jpg?v=638206690887830000"
        },
        {
          "title": "Gaseosa Coca-cola Sabor Original 1,75 Lt",
          "price": "$3760.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/gaseosa-coca-cola-sabor-original-1-75-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/783089/Gaseosa-Coca-cola-Sabor-Original-1-75-Lt-1-254543.jpg?v=638206690887830000"
        },
        {
          "title": "Gaseosa Coca Cola Zero 1.75lt",
          "price": "$3760.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/gaseosa-coca-cola-zero-1-75lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/799927/Gaseosa-Coca-Cola-Zero-1-75lt-1-367450.jpg?v=638349573931070000"
        },
        {
          "title": "Duo Pack Gaseosa Coca Cola Original 2.25 L + Gaseosa Sprite Lima Limón 2.25 L",
          "price": "$6599.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/gaseosa-coca-cola-sabor-original-2-25-lt-sprite-lima-limon-2-25-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/303620/front-view-20222.jpg?v=638332509811830000"
        },
        {
          "title": "Gaseosa Coca Cola Sabor Original 500ml",
          "price": "$1899.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/gaseosa-coca-cola-sabor-original-500-ml-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/287182/front-view-27754.jpg?v=638229801820930000"
        },
        {
          "title": "Coca-cola Zero 500 Ml",
          "price": "$1900.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/coca-cola-zero-500-ml/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/799922/Gaseosa-Coca-Cola-Zero-X-500-Cc-1-19760.jpg?v=638349573908170000"
        },
        {
          "title": "Coca-cola Zero 354 Ml",
          "price": "$1900.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/coca-cola-zero-354-ml/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/799921/Gaseosa-Coca-Cola-Sin-Az-cares-Lata-354cc-1-19739.jpg?v=638349573903630000"
        }
      ],
      "totalFound": 25
    }
  },
  "papas": {
    "timestamp": "2025-07-06T06:31:21.993Z",
    "data": {
      "products": [
        {
          "title": "Papa Cepillada (bolsa Fraccionada Por 2 Kg) Precio Por Kilo",
          "price": "$1599.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/papa-cepillada-bolsa-fraccionada-por-2-kg-precio-por-kilo/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/424811/Papa-Cepillada-Fraccionada-Por-Kg-1-31766.jpg?v=636489103772470000"
        },
        {
          "title": "Papas Fritas Quento Snacks Ketchup",
          "price": "$2050.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-fritas-quento-snacks-ketchup/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/841049/Papas-Fritas-Quento-Snacks-Ketchup-1-1018872.jpg?v=638652948515970000"
        },
        {
          "title": "ñoquis De Papas 1 Kg",
          "price": "$2694.65",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/noquis-de-papas-1-kg/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/748000/oquis-De-Papas-1-Kg-1-20702.jpg?v=637998033634800000"
        },
        {
          "title": "Papas Cocidas Santa Maria",
          "price": "$2899.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-cocidas-santa-maria/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/823465/Papas-Cocidas-Santa-Maria-1-1015345.jpg?v=638508255566300000"
        },
        {
          "title": "Papas Bastón Congeladas Dia 700 Gr.",
          "price": "$3190.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/papas-baston-congeladas-dia-700-gr-56048/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/343930/Papas-Baston-Congeladas-Dia-700-Gr-_1.jpg?v=638736548971830000"
        },
        {
          "title": "Papas Plychaco Noisette 500 Gr",
          "price": "$2499.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/papas-plychaco-noisette-500-gr/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/711978/Papas-Plychaco-Noisette-500-Gr-1-14021.jpg?v=637943817746800000"
        },
        {
          "title": "Papas Plychaco Noisette 500 Gr",
          "price": "$2499.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-plychaco-noisette-500-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/711978/Papas-Plychaco-Noisette-500-Gr-1-14021.jpg?v=637943817746800000"
        },
        {
          "title": "Papas Noisette Congeladas Dia 500 Gr.",
          "price": "$3490.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/papas-noisette-congeladas-dia-500-gr-222706/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/344565/Papas-Noisette-Congeladas-Dia-500-Gr-_1.jpg?v=638743459104670000"
        },
        {
          "title": "Papas Fritas Bastón Mc Cain Clásicas Corte Tradicional 700g",
          "price": "$5529.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/papas-fritas-baston-mc-cain-clasicas-corte-tradicional-700g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/311765/Papas-Fritas-Bast-n-Mc-Cain-Cl-sicas-Corte-Tradicional-700g-1-48282.jpg?v=638400873746030000"
        },
        {
          "title": "Papas Noisette Mc Cain 600 G",
          "price": "$4809.35",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/papas-noisette-mccain-600-g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/311814/Papas-Noisette-Mccain-600-G-1-52875.jpg?v=638402493840800000"
        },
        {
          "title": "Papas Clásicas Corte Tradicional 700 Gr Mc Cain",
          "price": "$5635.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/papas-clasicas-corte-tradicional-700-gr-mc-cain/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/805893/Papas-Clasicas-Corte-Tradicional-Mc-Cain-700g-1-978349.jpg?v=638399147508500000"
        },
        {
          "title": "Papas Rústicas Simplot 700 Gr",
          "price": "$6000.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-rusticas-simplot-700-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/790326/Papas-R-sticas-Simplot-700-Gr-1-843725.jpg?v=638272137705400000"
        },
        {
          "title": "Papas Steakhouse 700 Gr Simplot",
          "price": "$6000.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-steakhouse-700-gr-simplot/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/790328/Papas-Simplot-Steakhouse-700-Gr-1-846005.jpg?v=638272137711800000"
        },
        {
          "title": "Papas Fritas Aliada Corte Tradicional 250 G",
          "price": "$3279.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/papas-fritas-clasicas-acuenta-x-250-gr-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/310864/0779912000033-01-14734.jpg?v=638392125725170000"
        },
        {
          "title": "Papas Fritas Tradicionales 250 Grs Cuisine & Co",
          "price": "$4640.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/papas-fritas-tradicionales-250-grs-cuisine-co/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/791437/Papas-Fritas-Tradicion-Cuisine-co-250gr-Papas-Fritas-Cuisine-Co-Tradicionales-250gr-1-865697.jpg?v=638288337948700000"
        },
        {
          "title": "Papas Pay Krachitos 150 Gr",
          "price": "$3050.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-pay-krachitos-150-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/781437/Papas-Pay-Krachitos-X-150g-1-957942.jpg?v=638195134193330000"
        },
        {
          "title": "Papas Fritas Lays Clásicas X 85 Gr.",
          "price": "$2100.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/papas-fritas-lays-clasicas-x-85-gr-172869/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/313899/Papas-Fritas-Lays-Clasicas-X-85-Gr-_1.jpg?v=638599420342730000"
        },
        {
          "title": "Papas Ketchup Krachitos 90 Gr",
          "price": "$2350.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-ketchup-krachitos-90-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/774425/Papas-Krach-itos-Ketchup-X90g-1-945002.jpg?v=638150314266200000"
        },
        {
          "title": "Papas Cheddar Krachitos 90 Gr",
          "price": "$2350.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-cheddar-krachitos-90-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/767071/Papas-Krach-itos-Cheddar-X90g-1-944922.jpg?v=638110353780070000"
        },
        {
          "title": "Papas Pay Krachitos 55 Gr",
          "price": "$1450.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/papas-pay-krachitos-55-gr/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/767073/Papas-Krach-itos-Pay-X55g-1-944924.jpg?v=638110353785830000"
        },
        {
          "title": "Papas Fritas Alwa x 80 g",
          "price": "$2180.00",
          "store": "disco",
          "link": "https://www.farmacity.com/papas-fritas-alwa-x-80-g/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/244251/160547_papas-fritas-alwa-x-100-gr___imagen-1.jpg?v=638659786574530000"
        },
        {
          "title": "Papas Fritas Lays Clásicas X 134 Gr",
          "price": "$4650.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/papas-fritas-lays-clasicas-x-134-gr/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/826844/Papas-Fritas-Lays-Cl-sicas-X-134-Gr-1-972387.jpg?v=638556933867500000"
        },
        {
          "title": "Papas Fritas Pringles Original X104gs",
          "price": "$4900.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/papas-fritas-pringles-original-x104gs/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/800601/Papas-Fritas-Pringles-Original-X104gs-1-1000004.jpg?v=638355837787270000"
        }
      ],
      "totalFound": 23
    }
  },
  "jugo": {
    "timestamp": "2025-07-06T07:27:42.457Z",
    "data": {
      "products": [
        {
          "title": "Jugo Arcor Manzana x 1 l",
          "price": "$980.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jugo-arcor-manzana-x-1l/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/251941/238928_jugo-arcor-manzana-x-1-l_imagen-1.jpg?v=638435980068170000"
        },
        {
          "title": "Jugo Arcor Naranja x 1 l",
          "price": "$980.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jugo-arcor-naranja-x-1l/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/251940/238927_jugo-arcor-naranja-x-1-l_imagen-1.jpg?v=638435980064270000"
        },
        {
          "title": "Jugo Cepita Del Valle Manzana 1 Lt",
          "price": "$1950.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/jugo-cepita-del-valle-manzana-1-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/800384/Jugo-Cepita-Jugo-Cepita-Del-Valle-25-Manzana-1-Lt-1-248259.jpg?v=638354978944530000"
        },
        {
          "title": "Jugo Listo Cepita Naranja - 1 L",
          "price": "$1950.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/jugo-listo-cepita-naranja-1-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/801083/Jugo-Cepita-Naranja-20-1lt-Jugo-Cepita-Del-Valle-20-Naranja-1-Lt-1-888038.jpg?v=638367069980200000"
        },
        {
          "title": "Jugo Cepita Del Valle Multifruta 1 Lt",
          "price": "$1950.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/jugo-cepita-del-valle-multifruta-1-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/800370/Jugo-Cepita-X-1-Lt-1-20467.jpg?v=638354978888270000"
        },
        {
          "title": "Jugo Listo Cepita Naranja - 1 L",
          "price": "$2009.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/jugo-listo-cepita-naranja-1-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/801083/Jugo-Cepita-Naranja-20-1lt-Jugo-Cepita-Del-Valle-20-Naranja-1-Lt-1-888038.jpg?v=638367069980200000"
        },
        {
          "title": "Jugo Cepita Del Valle Manzana 1 Lt",
          "price": "$2009.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/jugo-cepita-del-valle-manzana-1-lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/800384/Jugo-Cepita-Jugo-Cepita-Del-Valle-25-Manzana-1-Lt-1-248259.jpg?v=638354978944530000"
        },
        {
          "title": "Jugo Ades Manzana 1lt",
          "price": "$2300.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/jugo-ades-manzana-1lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/770837/Ades-Soja-Jugo-De-Manzana-1-L-1-17840.jpg?v=638128606012000000"
        },
        {
          "title": "Jugo Ades Manzana 1lt",
          "price": "$2300.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/jugo-ades-manzana-1lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/770837/Ades-Soja-Jugo-De-Manzana-1-L-1-17840.jpg?v=638128606012000000"
        },
        {
          "title": "Jugo Smudis Sabor Naranja Frutilla x 1 lt",
          "price": "$2360.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jugo-smudis-sabor-naranja-frutilla-x-1-lt/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/260278/239428_jugo-smudis-sabor-naranja-frutilla-x-1-lt_imagen-1.png?v=638621061479770000"
        },
        {
          "title": "Jugo Ades Manzana 1lt",
          "price": "$2369.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/jugo-ades-manzana-1lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/770837/Ades-Soja-Jugo-De-Manzana-1-L-1-17840.jpg?v=638128606012000000"
        },
        {
          "title": "Jugo Exprimido Pura Frutta de Naranja x 1 l",
          "price": "$3350.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jugo-exprimido-de-naranja-pura-frutta-x-1-l/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/196507/214153_jugo-exprimido-de-naranja-pura-frutta-x-1-l_imagen-1.jpg?v=637196435016400000"
        },
        {
          "title": "Jugo De Naranja Con Pulpa 1 L Citric",
          "price": "$4850.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/jugo-de-naranja-con-pulpa-1-l-citric/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/823375/Jugo-Citric-Naranja-Pb-1l-1-1014695.jpg?v=638508253486870000"
        },
        {
          "title": "Jugo En Polvo Tang Manzana 15 Gr.",
          "price": "$385.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/jugo-en-polvo-tang-manzana-15-gr-274181/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/322561/Jugo-En-Polvo-Tang-Manzana-15-Gr-_1.jpg?v=638599545328330000"
        },
        {
          "title": "Jugo En Polvo Naranja Dulce Bc 7 Gr",
          "price": "$309.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/jugo-en-polvo-naranja-dulce-bc-7-gr-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/218316/0779058012996-01-1298.jpg?v=637854287010630000"
        },
        {
          "title": "Jugo en polvo Clight pomelo rosado 8 g.",
          "price": "$389.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/jugo-en-polvo-clight-pomelo-rosado-8-g-711440/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/429022/7622201703172_E01.jpg?v=638393925081100000"
        },
        {
          "title": "Jugo En Polvo Clight Limonada Arándanos 8 G",
          "price": "$399.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/jugo-en-polvo-clight-limonada-arandanos-8g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/330999/Jugo-En-Polvo-Clight-Limonada-Ar-ndanos-8g-1-60344.jpg?v=638718537660830000"
        },
        {
          "title": "Jugo En Polvo Clight Limonada 8 Gr.",
          "price": "$405.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/jugo-en-polvo-clight-limonada-8-gr-274273/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/322624/Jugo-En-Polvo-Clight-Limonada-8-Gr-_1.jpg?v=638599546107400000"
        },
        {
          "title": "Jugo En Polvo Clight Naranja Dulce 7,5 Gr.",
          "price": "$380.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/jugo-en-polvo-clight-naranja-dulce-75-gr-274215/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/322612/Jugo-En-Polvo-Clight-Naranja-Dulce-75-Gr-_1.jpg?v=638599545927670000"
        },
        {
          "title": "Jugo en polvo Clight naranja durazno 7.5 g.",
          "price": "$389.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/jugo-en-polvo-clight-naranja-durazno-75-g-711435/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/429003/7622201702717_E01.jpg?v=638393919360370000"
        },
        {
          "title": "Jugo en polvo Clight naranja dulce 7.5 g.",
          "price": "$389.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/jugo-en-polvo-clight-naranja-dulce-75-g-711439/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/429018/7622201703141_E01.jpg?v=638393924065100000"
        },
        {
          "title": "Jugo En Polvo Clight Naranja Dulce 7,5 G",
          "price": "$399.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/jugo-en-polvo-clight-sabor-naranja-dulce-7-5g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/343901/Jugo-En-Polvo-Clight-Naranja-Dulce-7-5-G-0762220170314-1.jpg?v=638718536081430000"
        },
        {
          "title": "Jugo En Polvo Clight Manzana Deliciosa 7 Gr.",
          "price": "$380.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/jugo-en-polvo-clight-manzana-deliciosa-7-gr-274216/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/322616/Jugo-En-Polvo-Clight-Manzana-Deliciosa-7-Gr-_1.jpg?v=638599546010130000"
        },
        {
          "title": "Jugo en polvo Clight manzana deliciosa 7 g.",
          "price": "$389.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/jugo-en-polvo-clight-manzana-deliciosa-7-g-711437/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/429010/7622201703080_E01.jpg?v=638393921527130000"
        },
        {
          "title": "Jugo En Polvo Clight Manzana Deliciosa 7 G",
          "price": "$399.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/jugo-en-polvo-clight-sabor-manzana-deliciosa-7g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/343910/Jugo-En-Polvo-Clight-Manzana-Deliciosa-7-G-0762220170308-1.jpg?v=638718538322670000"
        }
      ],
      "totalFound": 25
    }
  },
  "agua": {
    "timestamp": "2025-07-06T07:27:44.490Z",
    "data": {
      "products": [
        {
          "title": "Agua de mesa sin gas Bulnez bidón 6,5 lts",
          "price": "$2190.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/agua-de-mesa-sin-gas-bulnez-bidon-65-lts-737480/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/542357/7791720032275_01.jpg?v=638568433420700000"
        },
        {
          "title": "Agua Mineralizada Cellier 2 Lts",
          "price": "$799.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/agua-mineralizada-cellier-2-lts-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/172778/Agua-Mineralizada-Cellier-2-Lts-1-31146.jpg?v=637835147076200000"
        },
        {
          "title": "Agua mineralizada sin gas Cellier Favaloro 2 lts",
          "price": "$979.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/agua-mineralizada-sin-gas-cellier-favaloro-2-lts-530438/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/268842/7790639002416_01.jpg?v=638074040790130000"
        },
        {
          "title": "Agua de mesa sin gas Villa del Sur bidón 6,2 lts",
          "price": "$3425.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/agua-de-mesa-sin-gas-villa-del-sur-bidon-62-lts-720844/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/328244/7799155000135_01.jpg?v=638204601951300000"
        },
        {
          "title": "Agua Villa Del Sur Sin Gas Bidon 6.2 L",
          "price": "$3829.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/agua-villa-del-sur-sin-gas-bidon-6-2-l-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/333501/Agua-Villa-Del-Sur-Sin-Gas-Bidon-6-2-L-1-45335.jpg?v=638615901801170000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 6 Lt.",
          "price": "$4000.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/agua-de-mesa-benedictino-sin-gas-6-lt-300178/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/338749/Agua-De-Mesa-Benedictino-Sin-Gas-6-Lt-_1.jpg?v=638677892757530000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 6 L",
          "price": "$4000.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/agua-de-mesa-benedictino-sin-gas-6-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/846486/Agua-Benedictino-Sin-Gas-6lt-1-999587.jpg?v=638678865884870000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 6 L",
          "price": "$4120.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/agua-de-mesa-benedictino-sin-gas-6-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/846486/Agua-Benedictino-Sin-Gas-6lt-1-999587.jpg?v=638678865884870000"
        },
        {
          "title": "Agua Nestle Pureza Vital 6.3lt",
          "price": "$5260.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-nestle-pureza-vital-6-3lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/872568/Agua-Nestle-Pureza-Vital-6-3lt-1-241133.jpg?v=638864625727000000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 2,25 Lt.",
          "price": "$1900.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/agua-de-mesa-benedictino-sin-gas-225-lt-300182/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/338753/Agua-De-Mesa-Benedictino-Sin-Gas-225-Lt-_1.jpg?v=638677892808700000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 1,5 Lt.",
          "price": "$1600.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/agua-de-mesa-benedictino-sin-gas-15-lt-300183/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/338755/Agua-De-Mesa-Benedictino-Sin-Gas-15-Lt-_1.jpg?v=638677892830670000"
        },
        {
          "title": "Agua Saborizada Levite Sabor Pomelo 2,25 L",
          "price": "$2599.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/agua-saborizada-pomelo-levite-2-25-lt-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/320806/front-view-12857.jpg?v=638490837770200000"
        },
        {
          "title": "Agua Sin Gas Villavicencio 2 L",
          "price": "$2415.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/agua-sin-gas-villavicencio-2-l/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/835768/Agua-Sin-Gas-Villavicencio-2-L-1-997460.jpg?v=638627063510370000"
        },
        {
          "title": "Agua Mineral Eco De Los Andes Sin Gas 2 L",
          "price": "$2460.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-mineral-eco-de-los-andes-sin-gas-2-l/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/816033/Agua-Mineral-Eco-De-Los-Andes-Sin-Gas-2-L-1-239957.jpg?v=638467190629970000"
        },
        {
          "title": "Agua Mineral Villavicencio Sin Gas 2 L",
          "price": "$2479.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/agua-mineral-villavicencio-sin-gas-2-l-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/332705/Agua-Mineral-Villavicencio-Sin-Gas-2-L-1-49114.jpg?v=638606505884600000"
        },
        {
          "title": "Agua Smart Water Sin Gas 1.5lt",
          "price": "$1900.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-smart-water-sin-gas-1-5lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/787830/Agua-Mineral-Smartwater-Sin-Gas-1-5-Lt-1-797448.jpg?v=638246002031800000"
        },
        {
          "title": "Agua Smart Water Sin Gas 1.5lt",
          "price": "$1900.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/agua-smart-water-sin-gas-1-5lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/787830/Agua-Mineral-Smartwater-Sin-Gas-1-5-Lt-1-797448.jpg?v=638246002031800000"
        },
        {
          "title": "Agua Smart Water Sin Gas 1.5lt",
          "price": "$1957.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/agua-smart-water-sin-gas-1-5lt/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/787830/Agua-Mineral-Smartwater-Sin-Gas-1-5-Lt-1-797448.jpg?v=638246002031800000"
        },
        {
          "title": "Agua Eco De Los Andes Con Gas Botella 1,5ltx1",
          "price": "$2330.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-eco-de-los-andes-con-gas-botella-1-5ltx1/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/816031/Agua-Eco-De-Los-Andes-Con-Gas-Botella-1-5ltx1-1-239793.jpg?v=638467190623500000"
        },
        {
          "title": "Agua Eco De Los Andes Con Gas Botella 1,5ltx1",
          "price": "$2330.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/agua-eco-de-los-andes-con-gas-botella-1-5ltx1/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/816031/Agua-Eco-De-Los-Andes-Con-Gas-Botella-1-5ltx1-1-239793.jpg?v=638467190623500000"
        },
        {
          "title": "Agua Baja En Sodio Glaciar Con Gas 1.5 L",
          "price": "$2565.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-baja-en-sodio-glaciar-con-gas-1-5-l/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/544763/Agua-Baja-En-Sodio-Glaciar-Con-Gas-15-L-1-240110.jpg?v=637014360501200000"
        },
        {
          "title": "Agua De Mesa Benedictino Sin Gas 500 Ml.",
          "price": "$1300.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/agua-de-mesa-benedictino-sin-gas-500-ml-300181/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/338751/Agua-De-Mesa-Benedictino-Sin-Gas-500-Ml-_1.jpg?v=638677892779700000"
        },
        {
          "title": "Agua Micelar Nivea Energy Vitamina C para Todo tipo de Piel x 400 ml",
          "price": "$6540.00",
          "store": "disco",
          "link": "https://www.farmacity.com/agua-micelar-nivea-energy-x-400-ml/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/258204/230289_agua-micelar-nivea-energy-x-400-ml_imagen-1.jpg?v=638562282630170000"
        },
        {
          "title": "Agua Micelar Nivea Rose Care 400 Ml",
          "price": "$14050.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/agua-micelar-nivea-rose-care-400-ml/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/786898/Agua-Micelar-Nivea-Rose-Care-400-Ml-1-878932.jpg?v=638239953941700000"
        },
        {
          "title": "Agua Micelar Dermaglós Piel Mixta a Grasa x 200 ml",
          "price": "$9067.00",
          "store": "disco",
          "link": "https://www.farmacity.com/agua-micelar-dermaglos-piel-mixta-a-grasa-x-200-ml/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/262450/242612_agua-micelar-dermaglos-piel-mixta-a-grasa-x-200-ml_imagen-1.jpg?v=638665148888070000"
        },
        {
          "title": "Agua Micelar Filomena Wild Relief Elixir x 125 ml",
          "price": "$11000.00",
          "store": "disco",
          "link": "https://www.farmacity.com/agua-micelar-filomena-wild-relief-elixir-x-125-ml/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/244253/234009_agua-micelar-filomena-wild-relief-elixir-x-125-ml__imagen-1.jpg?v=638235617488170000"
        },
        {
          "title": "Agua Protectora Solar Vichy Capital Soleil Potenciadora del Bronceado Fps 50 x 200 ml",
          "price": "$48948.00",
          "store": "disco",
          "link": "https://www.farmacity.com/agua-protectora-solar-vichy-capital-soleil-potenciadora-del-bronceado-fps-50/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/233023/217700_agua-protectora-solar-vichy-capital-soleil-potenciadora-del-bronceado-fps-50_imagen-1.jpg?v=638065386064870000"
        }
      ],
      "totalFound": 27
    }
  },
  "manzana": {
    "timestamp": "2025-07-06T07:30:21.340Z",
    "data": {
      "products": [
        {
          "title": "Jugo Arcor Manzana x 1 l",
          "price": "$980.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jugo-arcor-manzana-x-1l/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/251941/238928_jugo-arcor-manzana-x-1-l_imagen-1.jpg?v=638435980068170000"
        },
        {
          "title": "Saborizada Aquarius Manzana 2.25lt",
          "price": "$2600.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/saborizada-aquarius-manzana-2-25lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/783098/Agua-Saborizada-Aquarius-Manzana-2-25-Lt-1-468840.jpg?v=638206693733570000"
        },
        {
          "title": "Saborizada Levite Manzana 2.25lt",
          "price": "$2600.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/saborizada-levite-manzana-2-25lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/833870/Saborizada-Levite-Manzana-2-25lt-1-838138.jpg?v=638615902367800000"
        },
        {
          "title": "Manzana En Bolsa 1,5 Kg",
          "price": "$1899.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/manzana-en-bolsa-1-kg/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/327119/Manzana-En-Bolsa-1-Kg-1-58250.jpg?v=638550453787470000"
        },
        {
          "title": "Sidra Pet Manzanas De Oro 910 Ml.",
          "price": "$1390.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/sidra-pet-manzanas-de-oro-910-ml-304703/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/335194/Sidra-Pet-Manzanas-De-Oro-910-Ml-_1.jpg?v=638645821919070000"
        },
        {
          "title": "Isotonico Powerade Manzana 995cc",
          "price": "$1800.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/isotonico-powerade-manzana-995cc/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/783046/Bebida-Isotonica-Powerade-Manzana-995-Ml-1-40818.jpg?v=638206690680900000"
        },
        {
          "title": "Isotonico Gatorade Manzana 1.25lt",
          "price": "$2320.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/isotonico-gatorade-manzana-1-25lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/793469/Gaseosa-Isotonica-Gatorade-Manzana-1-25-L-1-248614.jpg?v=638303241723270000"
        },
        {
          "title": "Manzana Roja Comercial en bolsa malla x Kg.",
          "price": "$1890.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/manzana-roja-comercial-en-bolsa-malla-x-kg-90111/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/353422/Manzana-Roja-Comercial-en-bolsa-malla-x-Kg-_1.jpg?v=638871331483370000"
        },
        {
          "title": "Manzana roja x kg.",
          "price": "$1899.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/manzana-red-x-kg-432782/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/176814/2300397000002_02_1.jpg?v=637468574430000000"
        },
        {
          "title": "Manzana Red Delicius Por Kg",
          "price": "$1899.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/manzana-red-delicius-por-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/472481/Manzana-Roja-Por-Kg-1-7997.jpg?v=636694698370130000"
        },
        {
          "title": "Manzana Pink Lady Por Kg",
          "price": "$1999.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/manzana-pink-lady-por-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/429597/Manzana-Rome-Comercial-Por-Kg-1-8163.jpg?v=636501201513870000"
        },
        {
          "title": "Manzana Pink Lady Por Kg",
          "price": "$1999.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/manzana-pink-lady-por-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/429597/Manzana-Rome-Comercial-Por-Kg-1-8163.jpg?v=636501201513870000"
        },
        {
          "title": "Manzana Golden Elegida X 1 Kg.",
          "price": "$2299.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/manzana-golden-elegida-x-1-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870195/23110102002.jpg?v=638846576993930000"
        },
        {
          "title": "Jugo Ades Manzana 1lt",
          "price": "$2300.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/jugo-ades-manzana-1lt/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/770837/Ades-Soja-Jugo-De-Manzana-1-L-1-17840.jpg?v=638128606012000000"
        },
        {
          "title": "Manzana Rome 1 Kg",
          "price": "$2499.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/manzana-rome-1-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/180081/Manzana-Manzana-Rome-1-Kg-1-10891.jpg?v=636383390110170000"
        },
        {
          "title": "Manzana Elegida Por Kg",
          "price": "$2599.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/manzana-elegida-por-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/429606/Manzana-Elegida-Por-Kg-1-10892.jpg?v=636501201546570000"
        },
        {
          "title": "Isotonico Gatorade Manzana 750cc",
          "price": "$2050.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/isotonico-gatorade-manzana-750cc/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/793466/Jugo-Gatorade-Isot-nica-Gatorade-Manzana-750-Ml-1-44565.jpg?v=638303241706530000"
        },
        {
          "title": "Manzana Roja x 1 Kg.",
          "price": "$2790.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/manzana-roja-x-1-kg-90039/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/335907/Manzana-Roja-x-1-Kg-_1.jpg?v=638653936504400000"
        },
        {
          "title": "Manzana Verde x 1 Kg.",
          "price": "$3490.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/manzana-verde-x-1-kg-90112/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/310398/Manzana-Verde-x-1-Kg-_1.jpg?v=638599371199600000"
        },
        {
          "title": "Manzana granny especial x kg.",
          "price": "$3490.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/manzana-granny-especial-x-kg-61585/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/213944/2320085000008_02.jpg?v=637677533665770000"
        },
        {
          "title": "Isotónica Gatorade Manzana Botella 500mlx1",
          "price": "$1810.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/isotonica-gatorade-manzana-botella-500mlx1/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/793459/Jugo-Gatorade-Manzana-X-500-Cc-Isot-nica-Gatorade-Manzana-500-Ml-1-19323.jpg?v=638303241676900000"
        },
        {
          "title": "Manzana Gran Smith X Kg",
          "price": "$3999.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/manzana-gran-smith-x-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/472810/Manzana-Gran-Smith-Elegida-Por-Kg-1-10920.jpg?v=636695562318370000"
        },
        {
          "title": "Manzana Gran Smith X Kg",
          "price": "$3999.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/manzana-gran-smith-x-kg/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/472810/Manzana-Gran-Smith-Elegida-Por-Kg-1-10920.jpg?v=636695562318370000"
        },
        {
          "title": "Manzana roja Huella Natural x kg.",
          "price": "$3999.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/manzana-roja-huella-natural-x-kg/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/176823/2303522000007_01.jpg?v=637468574453170000"
        },
        {
          "title": "Manzana Roja 400g",
          "price": "$2689.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/manzana-roja-400g/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/294146/Manzana-Roja-400g-1-45944.jpg?v=638277322423130000"
        },
        {
          "title": "Manzana Granny 400g",
          "price": "$3789.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/manzana-granny-400g/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/294147/Manzana-Granny-400g-1-45945.jpg?v=638277322425630000"
        },
        {
          "title": "Shampoo Head & Shoulders Manzana Fresh x 375 ml",
          "price": "$5901.00",
          "store": "disco",
          "link": "https://www.farmacity.com/shampoo-head-shoulders-manzana-fresh-375ml/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/254646/206045_shampoo-head-shoulders-manzana-fresh-375ml_imagen--1.jpg?v=638495713352200000"
        },
        {
          "title": "Manzana Roja Elegida 150 G",
          "price": "$3989.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/manzana-roja-elegida-150-g/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/355309/0274016000000-1.jpg?v=638840337120200000"
        },
        {
          "title": "Combo Barras de Cereal Nat sabor Manzana x 21 g x 12 un",
          "price": "$4806.00",
          "store": "disco",
          "link": "https://www.farmacity.com/combo-de-12-barras-de-cereal-sabor-manzana-x-21-gr/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/195440/215088_combo-de-12-barras-de-cereal-sabor-frutilla-y-yogur-x-25-gr_imagen-1.jpg?v=637177599591470000"
        }
      ],
      "totalFound": 29
    }
  },
  "pan": {
    "timestamp": "2025-07-06T09:29:11.285Z",
    "data": {
      "products": [
        {
          "title": "Pan Kaiser",
          "price": "$550.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-kaiser/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/650525/Pan-Kaiser-m-1-432431.jpg?v=637594962146300000"
        },
        {
          "title": "Pan de Hamburguesa Bimbo Artesano 4 Ud.",
          "price": "$3165.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/pan-de-hamburguesa-bimbo-artesano-4-ud-229492/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/352069/Pan-de-Hamburguesa-Bimbo-Artesano-4-Ud-_1.jpg?v=638847146121330000"
        },
        {
          "title": "Pan Lomitero (m)",
          "price": "$1400.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-lomitero-m-2/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/500704/Pan-Lomitero--m--1-306143.jpg?v=636798486925930000"
        },
        {
          "title": "Pan Pannini",
          "price": "$1400.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-pannini/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/516420/Pan-Pannini-1-306150.jpg?v=636840694927000000"
        },
        {
          "title": "Pan Para Chips",
          "price": "$1900.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-para-chips/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/504560/Pan-Para-Chips-1-307017.jpg?v=636816631011700000"
        },
        {
          "title": "Pan Rallado Preferido 1 Kg",
          "price": "$1916.85",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/pan-rallado-preferido-1-kg-2-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/316947/Pan-Rallado-Preferido-1-Kg-1-55202.jpg?v=638451741928200000"
        },
        {
          "title": "Pan Con Centeno Semillas",
          "price": "$3500.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-con-centeno-semillas/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/871819/Pan-Con-Centeno-Semillas-1-1025751.jpg?v=638853610279870000"
        },
        {
          "title": "Pan de mesa Carrefour classic con salvado 620 g.",
          "price": "$3106.10",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/pan-de-mesa-carrefour-classic-con-salvado-620-g/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/420131/7798152224131_01.jpg?v=638859473524170000"
        },
        {
          "title": "Pan Estrella Fresh",
          "price": "$6950.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-estrella-fresh/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/503044/Pan-Estrella-1-431877.jpg?v=636814902943670000"
        },
        {
          "title": "Pan Cereales Y Semillas Fargo 400 Gr.",
          "price": "$3250.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/pan-cereales-y-semillas-fargo-400-gr-279835/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/346802/Pan-Cereales-Y-Semillas-Fargo-400-Gr-_1.jpg?v=638760741022230000"
        },
        {
          "title": "Pan blanco Lactal 460 grs",
          "price": "$3780.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/pan-blanco-lactal-460-grs-717550/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/670152/7793890258752_01.jpg?v=638851770372530000"
        },
        {
          "title": "Pan Lactal Blanco 460 G",
          "price": "$3829.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/pan-lactal-blanco-460g-2/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/287227/Pan-Lactal-Blanco-460g-1-43926.jpg?v=638229802062700000"
        },
        {
          "title": "Pan De Salvado Fargo 390 Gr.",
          "price": "$3250.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/pan-de-salvado-fargo-390-gr-55252/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/352253/Pan-De-Salvado-Fargo-390-Gr-_1.jpg?v=638851462216100000"
        },
        {
          "title": "Plato De Pan Krea",
          "price": "$9350.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/plato-de-pan-krea/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/843771/Plato-De-Pan-Azul-1-U-Krea-Plato-De-Pan-Krea-1-986164.jpg?v=638658237688470000"
        },
        {
          "title": "Pan Blanco 610 Grs Bimbo",
          "price": "$6000.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/pan-blanco-610-grs-bimbo/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870656/Pan-Blanco-610-Gr-Bimbo-1-1030699.jpg?v=638848210513170000"
        },
        {
          "title": "Pan Blanco 610 Grs Bimbo",
          "price": "$6200.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/pan-blanco-610-grs-bimbo/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870656/Pan-Blanco-610-Gr-Bimbo-1-1030699.jpg?v=638848210513170000"
        },
        {
          "title": "Pan integral fargo bolsa 400 grs",
          "price": "$4145.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/pan-integral-fargo-bolsa-400-grs-758013/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/628795/7793890261486_01.jpg?v=638762040408200000"
        },
        {
          "title": "Pan Con Cereales Y Semillas X 400 Gr Fargo",
          "price": "$4600.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/pan-con-cereales-y-semillas-x-400-gr-fargo/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/855207/Pan-Con-Cereales-Y-Semillas-X-400-Gr-Fargo-1-1034487.jpg?v=638749713751770000"
        },
        {
          "title": "Pan Integral X 400 Gr Fargo",
          "price": "$4700.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/pan-integral-x-400-gr-fargo/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/855206/Pan-Integral-X-400-Gr-Fargo-1-1034486.jpg?v=638749713748170000"
        },
        {
          "title": "Pan Blanco Artesano con masa madre 500 grs",
          "price": "$6245.00",
          "store": "carrefour",
          "link": "https://www.carrefour.com.ar/pan-blanco-artesano-con-masa-madre-500-grs-753237/p",
          "image": "https://carrefourar.vtexassets.com/arquivos/ids/671049/7793890260885_01.jpg?v=638853456876900000"
        },
        {
          "title": "Pan Blanco Con Masa Madre 500 Grs Artesano",
          "price": "$6245.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/pan-blanco-con-masa-madre-500-grs-artesano/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870651/Pan-Blanco-Artesano-Masa-Madre-500-G-1-1029416.jpg?v=638848210493870000"
        },
        {
          "title": "Pan Blanco Artesano con Masa Madre 500 Gr.",
          "price": "$6245.00",
          "store": "diaonline",
          "link": "https://diaonline.supermercadosdia.com.ar/pan-blanco-artesano-con-masa-madre-500-gr-222898/p",
          "image": "https://ardiaprod.vtexassets.com/arquivos/ids/352065/Pan-Blanco-Artesano-con-Masa-Madre-500-Gr-_1.jpg?v=638847146077800000"
        },
        {
          "title": "Pan Blanco Con Masa Madre 500 Grs Artesano",
          "price": "$6330.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/pan-blanco-con-masa-madre-500-grs-artesano/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870651/Pan-Blanco-Artesano-Masa-Madre-500-G-1-1029416.jpg?v=638848210493870000"
        },
        {
          "title": "Pan Bimbo Artesano Blanco 500 G",
          "price": "$6499.00",
          "store": "masonline",
          "link": "https://www.masonline.com.ar/pan-bimbo-artesano-blanco-500-g/p",
          "image": "https://masonlineprod.vtexassets.com/arquivos/ids/340467/Pan-Bimbo-Artesano-Blanco-500-G-0779389026088-1.jpg?v=638683392656230000"
        },
        {
          "title": "Plato De Pan Turquesa Krea",
          "price": "$14299.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/plato-de-pan-turquesa-krea/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/842983/Plato-De-Pan-Turquesa-1-U-Krea-1-986165.jpg?v=638654782906730000"
        },
        {
          "title": "Pan Integral Con Masa Madre 500 Grs Artesano",
          "price": "$7200.00",
          "store": "vea",
          "link": "https://www.jumbo.com.ar/pan-integral-con-masa-madre-500-grs-artesano/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870650/Pan-Integral-Artesano-Masa-Madre-500-G-1-1029415.jpg?v=638848210490130000"
        },
        {
          "title": "Pan Integral Con Masa Madre 500 Grs Artesano",
          "price": "$7400.00",
          "store": "disco",
          "link": "https://www.disco.com.ar/pan-integral-con-masa-madre-500-grs-artesano/p",
          "image": "https://jumboargentina.vtexassets.com/arquivos/ids/870650/Pan-Integral-Artesano-Masa-Madre-500-G-1-1029415.jpg?v=638848210490130000"
        },
        {
          "title": "Pan Proteico 250g Mestemacher",
          "price": "$7990.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-proteico-250g-mestemacher/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/863046/Pan-Proteico-250g-Mestemacher-1-1035822.jpg?v=638797451489000000"
        },
        {
          "title": "Pan Natural 300g Mestemacher",
          "price": "$9990.00",
          "store": "jumbo",
          "link": "https://www.jumbo.com.ar/pan-natural-300g-mestemacher/p",
          "image": "https://jumboargentina.vteximg.com.br/arquivos/ids/863047/Pan-Natural-300g-Mestemacher-1-1035823.jpg?v=638797451492730000"
        },
        {
          "title": "Jabón Pan Boti-k Caléndula y Manzanilla x 85 g",
          "price": "$10145.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jabon-pan-boti-k-calendula-y-manzanilla-x-85g/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/201085/160105_jabon-pan-boti-k-calendula-y-manzanilla-x-85g_imagen-1.jpg?v=637302351960800000"
        },
        {
          "title": "Jabón Pan Rosas Rosa Mosqueta x 85 g",
          "price": "$10145.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jabon-pan-rosas-rosa-mosqueta-x-85-g/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/206642/160104_jabon-pan-rosas-rosa-mosqueta-x-85-g_imagen-1.jpg?v=637459687868330000"
        },
        {
          "title": "Jabón Pan Boti-k Romero y Tea Tree x 85 g",
          "price": "$10145.00",
          "store": "disco",
          "link": "https://www.farmacity.com/jabon-pan-boti-k-romero-y-tea-tree-x-85g/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/201084/160103_jabon-pan-boti-k-romero-y-tea-tree-x-85g_imagen-1.jpg?v=637302350106370000"
        },
        {
          "title": "Barra de Limpieza La Roche-Posay Dermatológico Lipikar Pan Surgras x 150 gr",
          "price": "$35635.00",
          "store": "disco",
          "link": "https://www.farmacity.com/pan-dermatologico-lipikar-surgras-x-150-gr/p",
          "image": "https://farmacityar.vtexassets.com/arquivos/ids/246566/8473_Pan-dermatologico-Lipikar-Surgras-x-150-g_imagen-1.jpg?v=638294354777330000"
        }
      ],
      "totalFound": 33
    }
  }
}

interface ScrapedProduct {
  title: string
  price: string
  store: string
  link: string
  image?: string
}

interface ComparisonRow {
  product: string
  quantity: number
  prices: { [store: string]: number | null }
  bestPrice: number | null
  bestStore: string | null
}

interface ComparisonResult {
  products: ComparisonRow[]
  storeTotals: { [store: string]: { total: number, itemsFound: number } }
  stores: string[]
}

interface CacheEntry {
  timestamp: string
  data: {
    products: ScrapedProduct[]
    totalFound: number
  }
}

interface Cache {
  [searchTerm: string]: CacheEntry
}

// Función para extraer precio numérico
function extractPrice(priceStr: string): number | null {
  const match = priceStr.match(/[\d,]+/)
  if (!match) return null
  
  const cleanPrice = match[0].replace(/,/g, '')
  return parseInt(cleanPrice)
}

// Función para buscar productos usando el scraper
async function scrapeProduct(searchTerm: string): Promise<ScrapedProduct[]> {
  try {
    console.log(`🔍 Searching for: ${searchTerm}`)
    
    const url = `https://go.ratoneando.ar?q=${encodeURIComponent(searchTerm.toLowerCase())}`
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://ratoneando.ar/',
        'Origin': 'https://ratoneando.ar',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
      },
      timeout: 10000,
    })
    
    console.log(`✅ Status: ${response.status}`)
    
    if (response.status !== 200) {
      throw new Error(`API returned status ${response.status}`)
    }
    
    const data = response.data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format')
    }
    
    const products = data.products || []
    console.log(`🎯 Found ${products.length} products`)
    
    // Parse products to our format
    const scrapedProducts: ScrapedProduct[] = products.map((product: { name?: string; price?: number | string; source?: string; link?: string; image?: string }) => ({
      title: product.name || 'Unknown Product',
      price: formatPrice(product.price),
      store: product.source || 'Unknown Store',
      link: product.link || '',
      image: product.image || undefined,
    }))
    
    return scrapedProducts
    
  } catch (error) {
    console.error(`Error scraping ${searchTerm}:`, error)
    return []
  }
}

// Función para formatear precio
function formatPrice(price: number | string | undefined): string {
  if (typeof price === 'number') {
    return `$${price.toFixed(2)}`
  }
  
  if (typeof price === 'string') {
    // Clean up price string
    return price.replace(/[^\d.,]/g, '').replace(',', '.')
  }
  
  return 'Price not available'
}

// Función para obtener término de búsqueda del nombre del producto
function getSearchTerm(productName: string): string {
  const searchMap: { [key: string]: string } = {
    'Coca Cola 2.25L': 'coca cola',
    'Leche entera 1L': 'leche',
    'Bife de chorizo': 'bife chorizo',
    'Chorizo': 'chorizo',
    'Pan francés': 'pan',
    'Ensalada mixta': 'ensalada',
    'Cerveza lata 473ml': 'cerveza'
  }
  
  return searchMap[productName] || productName.toLowerCase().split(' ')[0]
}

// Función para cargar cache
function loadCache(): Cache {
 return cache
}

// // Función para guardar cache
// function saveCache(cache: Cache): void {
//   const cacheFile = path.join(process.cwd(), 'cache.json')
  
//   try {
//     const dir = path.dirname(cacheFile)
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true })
//     }
    
//     fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
//     console.log('💾 Cache saved successfully')
//   } catch (error) {
//     console.error('Error saving cache:', error)
//   }
// }

// Función para verificar si el cache es válido (menos de 1 hora)
function isCacheValid(cacheEntry: CacheEntry): boolean {
  const now = new Date()
  const cacheTime = new Date(cacheEntry.timestamp)
  const hourDiff = (now.getTime() - cacheTime.getTime()) / (1000 * 60 * 60)
  
  return hourDiff < 1 // Cache válido por 1 hora
}

export async function POST(req: Request) {
  try {
    const { products } = await req.json()
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid products data' },
        { status: 400 }
      )
    }

    const productList: Product[] = products

    // Cargar cache
    const cache = loadCache()
    let cacheUpdated = false
    
    const comparisonRows: ComparisonRow[] = []
    const storeSet = new Set<string>()

    // Procesar cada producto
    for (const product of productList) {
      const productName = product.name
      const searchTerm = getSearchTerm(productName)
      console.log(`Processing: ${productName} (search: ${searchTerm})`)
      
      // Verificar si está en cache y es válido
      const cacheEntry = cache[searchTerm]
      let scrapedProducts: ScrapedProduct[] = []
      
      if (cacheEntry && isCacheValid(cacheEntry)) {
        console.log(`📖 Using cached data for: ${searchTerm}`)
        scrapedProducts = cacheEntry.data.products
      } else {
        console.log(`🔍 Scraping fresh data for: ${searchTerm}`)
        
        scrapedProducts = await scrapeProduct(searchTerm)
        
        console.log(scrapedProducts)

        // Solo guardar en cache si se encontraron productos
        if (scrapedProducts.length > 0) {
          cache[searchTerm] = {
            timestamp: new Date().toISOString(),
            data: {
              products: scrapedProducts,
              totalFound: scrapedProducts.length
            }
          }
          cacheUpdated = true
          console.log(`💾 Cached ${scrapedProducts.length} products for: ${searchTerm}`)
        } else {
          console.log(`⚠️  No products found for: ${searchTerm} - not caching`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Organizar precios por supermercado
      const prices: { [store: string]: number | null } = {}
      let bestPrice: number | null = null
      let bestStore: string | null = null
      
      scrapedProducts.forEach(item => {
        const price = extractPrice(item.price)
        if (price) {
          storeSet.add(item.store)
          
          // Tomar el mejor precio por supermercado
          if (!prices[item.store] || price < prices[item.store]!) {
            prices[item.store] = price
          }
          
          // Encontrar el mejor precio general
          if (!bestPrice || price < bestPrice) {
            bestPrice = price
            bestStore = item.store
          }
        }
      })
      
      comparisonRows.push({
        product: productName,
        quantity: product.quantity,
        prices,
        bestPrice,
        bestStore
      })
    }
    
    // Guardar cache si fue actualizado
    if (cacheUpdated) {
     // saveCache(cache)
    }

    // Calcular totales por supermercado
    const stores = Array.from(storeSet)
    const storeTotals: { [store: string]: { total: number, itemsFound: number } } = {}
    
    stores.forEach(store => {
      storeTotals[store] = { total: 0, itemsFound: 0 }
    })
    
    comparisonRows.forEach(row => {
      stores.forEach(store => {
        if (row.prices[store]) {
          storeTotals[store].total += row.prices[store]! * row.quantity
          storeTotals[store].itemsFound += 1
        }
      })
    })

    const result: ComparisonResult = {
      products: comparisonRows,
      storeTotals,
      stores: stores.sort()
    }

    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error in compare-prices endpoint:', error)
    return NextResponse.json(
      { error: 'Error comparing prices' },
      { status: 500 }
    )
  }
} 