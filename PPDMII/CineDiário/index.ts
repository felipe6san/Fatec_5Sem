export { default as SplashScreen } from './screens/SplashScreen';
export { default as DatabaseSelectionScreen } from './screens/DatabaseSelectionScreen';
export { default as HomeScreen } from './screens/HomeScreen';
export { default as AddMovieScreen } from './screens/AddMovieScreen';
export { default as EditMovieScreen } from './screens/EditMovieScreen';

export { useDatabaseContext, DatabaseContext } from './contexts/DatabaseContext';

export { generateId } from './utils/uuid';

export type { Production, ProductionType } from './types/Production';
