"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var uuid_1 = require("uuid");
// DnD
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
// Components
var Container_1 = require("@/components/Container");
var Item_1 = require("@/components/Item");
var Modal_1 = require("@/components/Modal");
var Input_1 = require("@/components/Input");
var Button_1 = require("@/components/Button");
function Home() {
    var _a = react_1.useState([
        { id: 'container-1', title: 'TODO', items: [] },
        { id: 'container-2', title: 'Doing', items: [] },
        { id: 'container-3', title: 'End', items: [] },
    ]), containers = _a[0], setContainers = _a[1];
    var _b = react_1.useState(null), activeId = _b[0], setActiveId = _b[1];
    var _c = react_1.useState(), currentContainerId = _c[0], setCurrentContainerId = _c[1];
    var _d = react_1.useState(''), itemName = _d[0], setItemName = _d[1];
    var _e = react_1.useState(false), showAddItemModal = _e[0], setShowAddItemModal = _e[1];
    var onAddItem = function () {
        if (!itemName)
            return;
        var id = "item-" + uuid_1.v4();
        var container = containers.find(function (item) { return item.id === currentContainerId; });
        if (!container)
            return;
        container.items.push({
            id: id,
            title: itemName
        });
        setContainers(__spreadArrays(containers));
        setItemName('');
        setShowAddItemModal(false);
    };
    // Find the value of the items
    function findValueOfItems(id, type) {
        if (type === 'container') {
            return containers.find(function (item) { return item.id === id; });
        }
        if (type === 'item') {
            return containers.find(function (container) {
                return container.items.find(function (item) { return item.id === id; });
            });
        }
    }
    var findItemTitle = function (id) {
        var container = findValueOfItems(id, 'item');
        if (!container)
            return '';
        var item = container.items.find(function (item) { return item.id === id; });
        if (!item)
            return '';
        return item.title;
    };
    var findContainerTitle = function (id) {
        var container = findValueOfItems(id, 'container');
        if (!container)
            return '';
        return container.title;
    };
    var findContainerItems = function (id) {
        var container = findValueOfItems(id, 'container');
        if (!container)
            return [];
        return container.items;
    };
    // DND Handlers
    var sensors = core_1.useSensors(core_1.useSensor(core_1.PointerSensor), core_1.useSensor(core_1.KeyboardSensor, {
        coordinateGetter: sortable_1.sortableKeyboardCoordinates
    }));
    function handleDragStart(event) {
        var active = event.active;
        var id = active.id;
        setActiveId(id);
    }
    var handleDragMove = function (event) {
        var active = event.active, over = event.over;
        // Handle Items Sorting
        if (active.id.toString().includes('item') && (over === null || over === void 0 ? void 0 : over.id.toString().includes('item')) &&
            active &&
            over &&
            active.id !== over.id) {
            // Find the active container and over container
            var activeContainer_1 = findValueOfItems(active.id, 'item');
            var overContainer_1 = findValueOfItems(over.id, 'item');
            // If the active or over container is not found, return
            if (!activeContainer_1 || !overContainer_1)
                return;
            // Find the index of the active and over container
            var activeContainerIndex = containers.findIndex(function (container) { return container.id === activeContainer_1.id; });
            var overContainerIndex = containers.findIndex(function (container) { return container.id === overContainer_1.id; });
            // Find the index of the active and over item
            var activeitemIndex = activeContainer_1.items.findIndex(function (item) { return item.id === active.id; });
            var overitemIndex = overContainer_1.items.findIndex(function (item) { return item.id === over.id; });
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                var newItems = __spreadArrays(containers);
                newItems[activeContainerIndex].items = sortable_1.arrayMove(newItems[activeContainerIndex].items, activeitemIndex, overitemIndex);
                setContainers(newItems);
            }
            else {
                // In different containers
                var newItems = __spreadArrays(containers);
                var removeditem = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)[0];
                newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
                setContainers(newItems);
            }
        }
        // Handling Item Drop Into a Container
        if (active.id.toString().includes('item') && (over === null || over === void 0 ? void 0 : over.id.toString().includes('container')) &&
            active &&
            over &&
            active.id !== over.id) {
            // Find the active and over container
            var activeContainer_2 = findValueOfItems(active.id, 'item');
            var overContainer_2 = findValueOfItems(over.id, 'container');
            // If the active or over container is not found, return
            if (!activeContainer_2 || !overContainer_2)
                return;
            // Find the index of the active and over container
            var activeContainerIndex = containers.findIndex(function (container) { return container.id === activeContainer_2.id; });
            var overContainerIndex = containers.findIndex(function (container) { return container.id === overContainer_2.id; });
            // Find the index of the active and over item
            var activeitemIndex = activeContainer_2.items.findIndex(function (item) { return item.id === active.id; });
            // Remove the active item from the active container and add it to the over container
            var newItems = __spreadArrays(containers);
            var removeditem = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)[0];
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
        }
    };
    // This is the function that handles the sorting of the containers and items when the user is done dragging.
    function handleDragEnd(event) {
        var active = event.active, over = event.over;
        // Handling Container Sorting
        if (active.id.toString().includes('container') && (over === null || over === void 0 ? void 0 : over.id.toString().includes('container')) &&
            active &&
            over &&
            active.id !== over.id) {
            // Find the index of the active and over container
            var activeContainerIndex = containers.findIndex(function (container) { return container.id === active.id; });
            var overContainerIndex = containers.findIndex(function (container) { return container.id === over.id; });
            // Swap the active and over container
            var newItems = __spreadArrays(containers);
            newItems = sortable_1.arrayMove(newItems, activeContainerIndex, overContainerIndex);
            setContainers(newItems);
        }
        // Handling item Sorting
        if (active.id.toString().includes('item') && (over === null || over === void 0 ? void 0 : over.id.toString().includes('item')) &&
            active &&
            over &&
            active.id !== over.id) {
            // Find the active and over container
            var activeContainer_3 = findValueOfItems(active.id, 'item');
            var overContainer_3 = findValueOfItems(over.id, 'item');
            // If the active or over container is not found, return
            if (!activeContainer_3 || !overContainer_3)
                return;
            // Find the index of the active and over container
            var activeContainerIndex = containers.findIndex(function (container) { return container.id === activeContainer_3.id; });
            var overContainerIndex = containers.findIndex(function (container) { return container.id === overContainer_3.id; });
            // Find the index of the active and over item
            var activeitemIndex = activeContainer_3.items.findIndex(function (item) { return item.id === active.id; });
            var overitemIndex = overContainer_3.items.findIndex(function (item) { return item.id === over.id; });
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                var newItems = __spreadArrays(containers);
                newItems[activeContainerIndex].items = sortable_1.arrayMove(newItems[activeContainerIndex].items, activeitemIndex, overitemIndex);
                setContainers(newItems);
            }
            else {
                // In different containers
                var newItems = __spreadArrays(containers);
                var removeditem = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)[0];
                newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
                setContainers(newItems);
            }
        }
        // Handling item dropping into Container
        if (active.id.toString().includes('item') && (over === null || over === void 0 ? void 0 : over.id.toString().includes('container')) &&
            active &&
            over &&
            active.id !== over.id) {
            // Find the active and over container
            var activeContainer_4 = findValueOfItems(active.id, 'item');
            var overContainer_4 = findValueOfItems(over.id, 'container');
            // If the active or over container is not found, return
            if (!activeContainer_4 || !overContainer_4)
                return;
            // Find the index of the active and over container
            var activeContainerIndex = containers.findIndex(function (container) { return container.id === activeContainer_4.id; });
            var overContainerIndex = containers.findIndex(function (container) { return container.id === overContainer_4.id; });
            // Find the index of the active and over item
            var activeitemIndex = activeContainer_4.items.findIndex(function (item) { return item.id === active.id; });
            var newItems = __spreadArrays(containers);
            var removeditem = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)[0];
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
        }
        setActiveId(null);
    }
    return (React.createElement("div", { className: "mx-auto max-w-7xl py-10" },
        React.createElement(Modal_1["default"], { showModal: showAddItemModal, setShowModal: setShowAddItemModal },
            React.createElement("div", { className: "flex flex-col w-full items-start gap-y-4" },
                React.createElement("h1", { className: "text-gray-800 text-3xl font-bold" }, "Add Item"),
                React.createElement(Input_1["default"], { type: "text", placeholder: "Item Title", name: "itemname", value: itemName, onChange: function (e) { return setItemName(e.target.value); } }),
                React.createElement(Button_1.Button, { onClick: onAddItem }, "Add Item"))),
        React.createElement("div", { className: "mt-10" },
            React.createElement("div", { className: "grid grid-cols-3 gap-6" },
                React.createElement(core_1.DndContext, { sensors: sensors, collisionDetection: core_1.closestCorners, onDragStart: handleDragStart, onDragMove: handleDragMove, onDragEnd: handleDragEnd },
                    React.createElement(sortable_1.SortableContext, { items: containers.map(function (i) { return i.id; }) }, containers.map(function (container) { return (React.createElement(Container_1["default"], { id: container.id, title: container.title, key: container.id, onAddItem: function () {
                            setShowAddItemModal(true);
                            setCurrentContainerId(container.id);
                        } },
                        React.createElement(sortable_1.SortableContext, { items: container.items.map(function (i) { return i.id; }) },
                            React.createElement("div", { className: "flex items-start flex-col gap-y-4" }, container.items.map(function (i) { return (React.createElement(Item_1["default"], { title: i.title, id: i.id, key: i.id })); }))))); })),
                    React.createElement(core_1.DragOverlay, { adjustScale: false },
                        activeId && activeId.toString().includes('item') && (React.createElement(Item_1["default"], { id: activeId, title: findItemTitle(activeId) })),
                        activeId && activeId.toString().includes('container') && (React.createElement(Container_1["default"], { id: activeId, title: findContainerTitle(activeId) }, findContainerItems(activeId).map(function (i) { return (React.createElement(Item_1["default"], { key: i.id, title: i.title, id: i.id })); })))))))));
}
exports["default"] = Home;
