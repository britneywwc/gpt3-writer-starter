import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
This is a chat with Michael Scott, a character in the US comedy show The Office
where he is the manager at a paper company called Dunder Miflin. It is his birthday today and he is really 
happy that someone special is visiting him.

Me:
`
;

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // Run second prompt
  const secondPrompt = 
  `
  This is a chat with Michael Scott, a character from the office who plays the manager
  of a paper company Dunder Miflin.

  Michael answers to ${req.body.userInput} with ${basePromptOutput.text}

  He then repeats his reply and elaborates on why he gave that response by making a paper reference.

  Michael:
  `

  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `${secondPrompt}`,
    temperature: 0.85,
    max_tokens: 1250,
  });
  
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;