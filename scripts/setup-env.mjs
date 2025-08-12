import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// Simulate __dirname and __filename in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define paths to point to the root directory (one level up from scripts/)
const rootDir = path.resolve(__dirname, '..')
const envExamplePath = path.join(rootDir, '.env.example')
const envDevPath = path.join(rootDir, '.env.development')
const envProdPath = path.join(rootDir, '.env.production')

// Function to check and create .env files
function createEnvFile(sourcePath, targetPath, envName, replace = {}) {
  // Check if the target file already exists
  if (fs.existsSync(targetPath)) {
    console.log(
      chalk.yellow(
        `Warning: ${path.basename(
          targetPath
        )} already exists. Skipping creation.`
      )
    )
    return false
  }

  // Read content from source (.env.example)
  let content = fs.readFileSync(sourcePath, 'utf-8')

  // Replace values as specified
  Object.entries(replace).forEach(([key, value]) => {
    const regex = new RegExp(`${key}=.*`, 'g')
    content = content.replace(regex, `${key}="${value}"`)
  })

  // Write the new file
  fs.writeFileSync(targetPath, content)
  console.log(chalk.green(`Created ${path.basename(targetPath)}`))
  return true
}

// Main function
function setupEnv() {
  // Check if .env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.error(chalk.red('Error: .env.example not found!'))
    process.exit(1)
  }

  try {
    // Create .env.development
    createEnvFile(envExamplePath, envDevPath, 'development', {
      NODE_ENV: 'development',
    })

    // Create .env.production
    createEnvFile(envExamplePath, envProdPath, 'production', {
      NODE_ENV: 'production',
    })

    // Notify the user to edit the files
    console.log(
      chalk.cyan(
        '\nPlease edit .env.development and .env.production with your configuration values.'
      )
    )
    console.log(
      chalk.cyan('You can use any text editor (e.g., nano, vim, or VS Code).')
    )
  } catch (error) {
    console.error(
      chalk.red(`Error: Failed to create .env files: ${error.message}`)
    )
    process.exit(1)
  }
}

// Run function
setupEnv()
