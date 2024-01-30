import { green } from "tailwindcss/colors"



class Node {
    constructor(row, col) {
        this.color = "transparent"

        this.row = row
        this.col = col

        this.top_border = "gray"
        this.right_border = "gray"
        this.left_border = "gray"
        this.bottom_border = "gray"

        this.visited = false
        this.explored = false

        this.neighbors = []
        this.neighbors_connected = []

        this.parent = null

    }
}

class Maze {
    constructor(rows, cols, initial_row, initial_col) {
        this.maze = []
        this.total_nodes = 2
        this.maze_created = false
        this.rows = rows
        this.cols = cols
        this.initial_row = initial_row
        this.initial_col = initial_col
        this.final_row = rows - 1
        this.final_col = cols - 1
        this.nodes_visited = 1
        this.stack = []
        this.current_cell = null
        this.final_cell = null
        this.found = false

        for (let i = 0; i < rows; i++) {
            this.maze.push([])
            for (let j = 0; j < cols; j++) {
                this.maze[i].push(new Node(i, j))
                this.total_nodes++;
            }

        }

        this.defineNeighbors()
    }


    addEdge(node, neighbor) {
        node.neighbors_connected.push(neighbor)
        neighbor.neighbors_connected.push(node)
    }

    defineNeighbors() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {

                if (0 < i && i < this.rows - 1 && 0 < j && j < this.cols - 1) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                } else if (i == 0 && j == 0) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                } else if (i == 0 && j == this.cols - 1) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                } else if (i == this.rows - 1 && j == this.cols - 1) {
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                } else if (i == this.rows - 1 && j == 0) {
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                } else if (i == 0) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                } else if (i == this.rows - 1) {
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                } else if (j == 0) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j + 1])//right
                } else if (j == this.cols - 1) {
                    this.maze[i][j].neighbors.push(this.maze[i + 1][j]) //bottom
                    this.maze[i][j].neighbors.push(this.maze[i - 1][j]) //top
                    this.maze[i][j].neighbors.push(this.maze[i][j - 1])//left
                }

            }
        }
    }

    breakBorder(node, neighbor, color) {
        if (neighbor.row == node.row + 1 && neighbor.col == node.col) {
            node.bottom_border = color
            neighbor.top_border = color
        } else if (neighbor.row == node.row - 1 && neighbor.col == node.col) {
            node.top_border = color
            neighbor.bottom_border = color
        } else if (neighbor.row == node.row && neighbor.col == node.col + 1) {
            node.right_border = color
            neighbor.left_border = color
        } else if (neighbor.row == node.row && neighbor.col == node.col - 1) {
            node.left_border = color
            neighbor.right_border = color
        }
    }

    removeNeighborsVisited(node) {
        return node.neighbors.filter(node => node.visited == false)
    }



    dfs() {

        this.current_cell.neighbors = this.removeNeighborsVisited(this.current_cell)

        if (this.current_cell.neighbors.length > 0) {
            let next_cell = this.current_cell.neighbors[Math.floor(Math.random() * this.current_cell.neighbors.length)]

            this.breakBorder(this.current_cell, next_cell, "green")
            this.addEdge(this.current_cell, next_cell)
            this.current_cell = next_cell
            this.current_cell.visited = true
            this.current_cell.color = "green"
            this.stack.push(this.current_cell)
            this.nodes_visited++;

        } else {
            this.current_cell.color = "yellow"


            if (this.current_cell.top_border == "green") {
                this.current_cell.top_border = "yellow"
            }
            if (this.current_cell.bottom_border == "green") {
                this.current_cell.bottom_border = "yellow"
            }
            if (this.current_cell.right_border == "green") {
                this.current_cell.right_border = "yellow"
            }
            if (this.current_cell.left_border == "green") {
                this.current_cell.left_border = "yellow"
            }

            if (this.stack.length == 1) {
                this.current_cell = this.stack.pop()
            } else {
                this.stack.pop()
                this.current_cell = this.stack[this.stack.length - 1]
            }
        }
        return this


    }

    bfs() {
        this.current_cell = this.stack.shift()
        this.current_cell.color = "red"

        if (this.current_cell.top_border == "yellow") {
            this.current_cell.top_border = "red"
        }
        if (this.current_cell.bottom_border == "yellow") {
            this.current_cell.bottom_border = "red"
        }
        if (this.current_cell.right_border == "yellow") {
            this.current_cell.right_border = "red"
        }
        if (this.current_cell.left_border == "yellow") {
            this.current_cell.left_border = "red"
        }



        for (let neighbor of this.current_cell.neighbors_connected) {
            if (neighbor.explored == false) {
                neighbor.parent = this.current_cell
                neighbor.explored = true
                this.stack.push(neighbor)
            }


            if (neighbor.row == this.final_cell.row && neighbor.col == this.final_cell.col) {
                this.current_cell = neighbor
                this.found = true
            }

        }

        return this
    }

    tracePath() {

        this.current_cell.color = "purple"

        if (this.current_cell.top_border == "yellow" || this.current_cell.top_border == "red") {
            this.current_cell.top_border = "purple"
        }
        if (this.current_cell.bottom_border == "yellow" || this.current_cell.bottom_border == "red") {
            this.current_cell.bottom_border = "purple"
        }
        if (this.current_cell.right_border == "yellow" || this.current_cell.right_border == "red") {
            this.current_cell.right_border = "purple"
        }
        if (this.current_cell.left_border == "yellow" || this.current_cell.left_border == "red") {
            this.current_cell.left_border = "purple"
        }

        if (this.current_cell.parent != null) {
            this.current_cell = this.current_cell.parent
        } else {
            this.current_cell.color = "green"
            this.found = true
        }
        return this
    }




}


export default { Maze }