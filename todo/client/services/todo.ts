import { UniqueIdentifier } from "@dnd-kit/core";

const url:string = 'http://127.0.0.1:3001';

type itemes = {
    ID: UniqueIdentifier;
    name: string;
    status: string;
}

export async function getItems() {
    try {
        const response = await fetch(url+'/todos',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while fetching the items:', error);
        return { "error": 'An error occurred while fetching the items' };}};


export async function addItem(item: itemes) {
    try {
        const response = await fetch(url+'/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred while adding the item:', error);
    }
}

export async function updateItem(item: itemes) {
    try {
        const response = await fetch(url+'/todos/'+ item.ID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('An error occurred while updating the item:', error);
    }
}

export async function deleteItem(id: UniqueIdentifier): Promise<void> {
    const response = await fetch(url+'/todos/'+ id, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

