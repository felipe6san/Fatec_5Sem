#%% Bibliotecas

from sklearn.neural_network import MLPClassifier

#%% Carga de Dados

x = [[0, 0], [0, 1], [1, 0], [1, 1]]
y = [0, 1, 1, 0]

#%% Config Rede

mlp = MLPClassifier(verbose = True,
                    hidden_layer_sizes = 4,
                    max_iter = 10000,
                    tol = 1e-6,
                    activation = 'relu') #constructor

#%% Treinamento de Rede

mlp.fit(x, y) # executa o treinamento

#%% Teste
for caso in x:
    print(f"Entrada: {caso} -> Saída: {mlp.predict([caso])}")

#%% Paramentros de rede

print(f'Classes: {mlp.classes_}')
print(f'Erro: {mlp.loss_}')
print(f'Amostras Visitadas: {mlp.t_}')
print(f'Atributos de entrada: {mlp.n_features_in_}')
print(f'Número de Ciclos: {mlp.n_iter_}')
print(f'Número de Camadas: {(mlp.n_layers_)}')
print(f'Tamanho das camadas ocultas: {mlp.hidden_layer_sizes}')
print(f'Número de neurônios saída: {(mlp.n_outputs_)}')
print(f'Função de Ativação: {mlp.out_activation_}')