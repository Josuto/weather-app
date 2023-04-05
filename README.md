This is a simple single-page [weather app](https://weather-app-josuto.vercel.app/) made in
React.

# How it works

The intent of this app is purely academic; I created it to further practice my knowledge
in web front-end app development in React. This weather app specifies a dropdown list that
serves as a municipality search bar so that any user can pick one at a time. When she does
it, a card showing several weather data (max, min, and current temperature, rain
probability, etc.) is displayed.

Cards include a save and a close button. When clicking on the save
button, some municipality identification data is stored at the local storage of the user's
browser, thus enabling the weather app to re-fetch the weather data of her favourite
municipalities whenever she comes back to the site where the app is hosted (unless she
manually deletes the browser local storage contents). Once saved, the user is also able to
discard the card from her favourite municipalities, thus deleting its related data from
the local storage.

The close button, on another hand, not only removes the card from the
view, but also deletes its related data from the local storage.

Last but not least, the weather app only works for Spanish municipalities, but I am pretty
sure that you are smart enough to update or even scale it to make it work with other
municipalities around the world ;-)

# Used practices

I used Test Driven-Development (TDD) to build this app. This means that before writing any
new feature, I first focused on building a test that I expected the code to pass following
the red-green-refactor loop. That
way, [paraphrasing Dave Farley](https://twitter.com/davefarley77/status/1640382698207297536),
I was able to work in small steps and getting really useful feedback on my endeavour.

On the topic of validation, it is also worth mentioning that I followed Kent C.Dodds'
[Testing Trophy](https://testingjavascript.com/) methodology to write the right (mostly
integration) tests to gain the required confidence on the validity of my code.

Another important point to mention is that single-page is not synonym of putting all the
code in one single file. Despite React is some fantastic library to build front-end
applications, we (developers) should follow standard patterns and techniques to modularise
our web apps, as mentioned by Juntao QIU
in [this inspiring article](https://martinfowler.com/articles/modularizing-react-apps.html).
So I did.

Finally, I also followed the [trunk-base development](https://trunkbaseddevelopment.com/)
methodology. Not to say that I needed
any other Git workflow for this project since I am the one and only developer of this app,
but I wanted to highlight the main benefit of this methodology: avoid the merge hell.
Besides, I truly believe that you do not need other branches when it comes to build an app
meant to provide users with new features (use feature toggles/flags if you are to
incorporate experimental ones).

# Used technologies

Here is a list of the most outstanding technologies that I used to implement this app:

- [Create React App](https://github.com/facebook/create-react-app) with React 18
- [Typescript](https://www.typescriptlang.org/)
- [MUI](https://mui.com/) component library
- [Custom MUI theme](https://mui.com/material-ui/customization/theming/)
  and React [useMediaQuery](https://mui.com/material-ui/react-use-media-query/) for
  responsive layouts
- [useSRW](https://swr.vercel.app/) to automatically fetch weather data updates from an
  external service
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  with [Jest](https://jestjs.io/) to validate the code
- [Husky](https://github.com/typicode/husky) to define both a pre-commit hook to TS
  compile and [prettify](https://prettier.io/) the code and a
  pre-push hook to run all the code tests before performing version control
- [Vercel](https://vercel.com/) as a deployment and hosting infrastructure
- CI/CD via [Github Actions](https://docs.github.com/en/actions)

# Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section
about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for
more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section
about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more
information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at
any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (
webpack, Babel, ESLint, etc) right into your project so you have full control over them.
All of the commands except `eject` will still work, but they will point to the copied
scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and
middle deployments, and you shouldn’t feel obligated to use this feature. However we
understand that this tool wouldn’t be useful if you couldn’t customize it when you are
ready for it.