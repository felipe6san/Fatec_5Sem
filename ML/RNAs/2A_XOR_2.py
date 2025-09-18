#%% Bibliotecas

from sklearn.neural_network import MLPClassifier

#%% Carga de Dados

X = [[0, 0], [0, 1], [1, 0], [1, 1]]
y = [0, 1, 1, 0]

#%% Config Rede

mlp = MLPClassifier(verbose=True, hidden_layer_sizes=4, max_iter=10000, tol=1e-6, activation='relu') #constructor

#%% Treinamento da Rede

mlp.fit(X, y) # executa treinamento - ver como a rede aprende

#%% teste
for caso in X:
    print(f'Caso: {caso} => Previsto: {mlp.predict([caso])}')
    
#%% Alguns Parametros da Rede

print(f'Classes: {mlp.classes_}') # Lista de classes
print(f'Erro: {mlp.loss_}') # Fator de perda(erro)
print(f'Amostras Visitadas: {mlp.t_}') # número de amostras de treinamento visitadas
print(f'Atributos de entrada: {mlp.n_features_in_}') # número de atributos de entrada
print(f'Número de Ciclos: {mlp.n_iter_}') # número iterações de treinamento
print(f'Número de Camadas: {mlp.n_layers_}') # número de camadas de rede
print(f'Tamanhos das camadas ocultas: {mlp.hidden_layer_sizes}') # tamanhos das camadas ocultas
print(f'Número de neurônios saída: {mlp.n_outputs_}') # número de neurônios na camada de saída
print(f'Função de ativação: {mlp.out_activation_}') # função de ativação da camada de saída