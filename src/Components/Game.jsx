import { useEffect, useState } from "react"
import tailwindColors from 'tailwindcss/colors'
import maze from "../logic/maze"

const Game = () => {
    const colors = { "transparent": tailwindColors.transparent, "gray": tailwindColors.black, "green": tailwindColors.green["300"], "yellow": tailwindColors.yellow["300"], "red": tailwindColors.red["300"], "purple": tailwindColors.purple["300"] }

    const [numRows, setNumRows] = useState(11)
    const [numCols, setNumCols] = useState(40)
    const [grid, setGrid] = useState(new maze.Maze(numRows, numCols, 0, 0))
    const [isDisabled, setIsDisabled] = useState(false)
    const [generationStep, setGenerationStep] = useState(0)


    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setNumRows(11)
                setNumCols(40)
            } else if (window.innerWidth >= 640) {
                console.log("resetting")
                setNumRows(9)
                setNumCols(20)
            } else {
                setNumRows(7)
                setNumCols(10)
            }
        }

        handleResize(); // Initial setup

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, [])



    const calculateCellWidth = () => {
        return `${100 / numCols}%`
    }

    const handleReset = () => {
        setGrid(new maze.Maze(numRows, numCols, 0, 0))
        setGenerationStep(0)
        setIsDisabled(false)
    }

    const runDFS = () => {
        grid.current_cell = grid.maze[Math.floor(Math.random() * grid.rows)][Math.floor(Math.random() * grid.cols)]

        grid.current_cell.visited = true
        grid.current_cell.color = "green"
        grid.stack.push(grid.current_cell)
        grid.nodes_visited = 1
        setIsDisabled(true)

        const interval = setInterval(() => {
            if (grid.nodes_visited != grid.total_nodes && grid.stack != 0) {
                const updatedGrid = grid.dfs()
                setGrid(updatedGrid)
                setGenerationStep(step => step + 1)
            } else {
                grid.maze_created = true
                setIsDisabled(false)
                setGenerationStep(0)
                clearInterval(interval)
            }
        }, 10)
    }

    const runBFS = () => {
        grid.current_cell = grid.maze[grid.initial_row][grid.initial_col]
        grid.final_cell = grid.maze[grid.final_row][grid.final_col]

        grid.current_cell.explored = true
        grid.stack = [grid.current_cell]
        setIsDisabled(true)
        const interval = setInterval(() => {
            if (grid.stack.length != 0 && !grid.found) {
                const updatedGrid = grid.bfs()
                setGrid(updatedGrid)
                setGenerationStep(step => step + 1)
            } else {
                setGenerationStep(0)
                clearInterval(interval)
                traceBack()
            }
        }, 5)
    }

    const traceBack = () => {
        grid.found = false
        const interval = setInterval(() => {
            if (!grid.found) {
                const updatedGrid = grid.tracePath()
                setGrid(updatedGrid)
                setGenerationStep(step => step + 1)
            } else {
                clearInterval(interval)
            }
        }, 15);
    }
    return (
        <>
            <div className="content">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${numCols}, 1fr)` }}>
                    {Array.from({ length: grid.rows }).map((_, rowIndex) => (
                        Array.from({ length: grid.cols }).map((_, colIndex) => (
                            <div key={`${rowIndex},${colIndex}`}
                                className="border"
                                style={{
                                    paddingBottom: calculateCellWidth,
                                    borderTopColor: colors[grid.maze[rowIndex][colIndex].top_border],
                                    borderRightColor: colors[grid.maze[rowIndex][colIndex].right_border],
                                    borderLeftColor: colors[grid.maze[rowIndex][colIndex].left_border],
                                    borderBottomColor: colors[grid.maze[rowIndex][colIndex].bottom_border],
                                    backgroundColor: colors[grid.maze[rowIndex][colIndex].color]
                                }}
                            />

                        ))
                    ))}

                </div>
            </div>
            <div className="bottom">
                <div className="flex justify-center p-3">
                    {
                        grid.maze_created
                            ? <button className="btn hover:cursor-pointer disabled:opacity-50" onClick={runBFS} disabled={isDisabled}>Solve</button>
                            : <button className="btn hover:cursor-pointer disabled:opacity-50" onClick={runDFS} disabled={isDisabled}>Generate</button>

                    }
                    <button className="btn hover:cursor-pointer" onClick={handleReset}>Reset Maze</button>
                </div>
            </div>
        </>
    )
}

export default Game