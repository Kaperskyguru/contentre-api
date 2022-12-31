import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logHelper } from '@/helpers/logger'
import { ApolloError } from 'apollo-server-errors'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: environment.openai.apiKey
})

const openai =
  environment.context === 'PRODUCTION' && new OpenAIApi(configuration)

const createOutline = async (input: any) => {
  if (!openai) {
    logHelper('createOutline %o', input)

    // Generate fake outline

    const outline = `
    I. Introduction
A. Definition of Backend Engineering
B. Overview of Backend Engineering

II. Basic Concepts of Backend Engineering
A. Database Management
B. Server Management
C. Application Programming

III. Advanced Concepts of Backend Engineering
A. Cloud Computing
B. Security
C. Performance Optimization

IV. Tools and Technologies for Backend Engineering
A. Programming Languages
B. Frameworks
C. Databases

V. Best Practices for Backend Engineering
A. Documentation
B. Version Control
C. Automation

VI. Conclusion`

    return {
      choices: [
        {
          text: outline
        }
      ]
    }
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: input.title,
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })

    return response.data
  } catch (e) {
    logError('createOutline %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500')
  }
}

const createSummary = async (input: any) => {
  if (!openai) {
    logHelper('createSummary %o', input)

    return false
  }
  try {
    return await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Say this is a test',
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })
  } catch (e) {
    logError('createSummary %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500')
  }
}

const createCodeSnippet = async (input: any) => {
  if (!openai) {
    logHelper('createCodeSnippet %o', input)

    return false
  }
  try {
    return await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Say this is a test',
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })
  } catch (e) {
    logError('createCodeSnippet %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500')
  }
}

export default {
  createCodeSnippet,
  createOutline,
  createSummary
}
