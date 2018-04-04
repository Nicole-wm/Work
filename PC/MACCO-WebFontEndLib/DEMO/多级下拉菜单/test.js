$(document).ready(function () {
    var menu = [
   { "id": "0", "name": "1", "level": "1", "src": "test1" },
   { "id": "1", "name": "2", "level": "1", "src": "test2" },
   { "id": "2", "name": "3", "level": "1", "src": "test3" },

   { "id": "3", "name": "1.1", "parent_id": "0", "level": "2", "src": "test1" },
   { "id": "4", "name": "1.2", "parent_id": "0", "level": "2", "src": "test2" },

   { "id": "5", "name": "2.1", "parent_id": "1", "level": "2", "src": "test3" },
   { "id": "6", "name": "2.2", "parent_id": "1", "level": "2", "src": "test1" },

   { "id": "7", "name": "3.1", "parent_id": "2", "level": "2", "src": "test2" },
   { "id": "8", "name": "3.2", "parent_id": "2", "level": "2", "src": "test3" },

   { "id": "9", "name": "1.1.1", "parent_id": "3", "level": "3", "src": "test1" },
   { "id": "10", "name": "1.1.2", "parent_id": "3", "level": "3", "src": "test2" },

   { "id": "11", "name": "1.2.1", "parent_id": "4", "level": "3", "src": "test3" },

   { "id": "12", "name": "2.1.1", "parent_id": "5", "level": "3", "src": "test1" },
   { "id": "13", "name": "2.1.2", "parent_id": "5", "level": "3", "src": "test2" },

   { "id": "14", "name": "2.2.1", "parent_id": "6", "level": "3", "src": "test3" },
   { "id": "15", "name": "2.2.2", "parent_id": "6", "level": "3", "src": "test1" },

   { "id": "16", "name": "3.1.1", "parent_id": "7", "level": "3", "src": "test2" },

   { "id": "17", "name": "3.2.1", "parent_id": "8", "level": "3", "src": "test1" },
   { "id": "18", "name": "3.2.2", "parent_id": "8", "level": "3", "src": "test2" },
   { "id": "19", "name": "3.2.3", "parent_id": "8", "level": "3", "src": "test3" }
    ];

    createMenu(menu,3);//菜单层数
});