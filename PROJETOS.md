# Registro de Projetos

> Registro canônico exigido pela regra global do kit-mcp.
> Campos marcados com (obrigatório) não podem ficar vazios.
> Gerenciável por `/base`; consumível em runtime pela MCP tool `projects` do kit.

## Projeto principal: vidro-orgânico

- **Pasta local do projeto** (obrigatório): `/home/victor/Documentos/DEV/vidro-organico`
- **Repositório do projeto** (obrigatório): https://github.com/VictorNascimento14/Design-moderno
- **Documentação local** (obrigatório): `/home/victor/Documentos/DEV/vidro-organico/docs`
- **Repositório da documentação** (opcional): — (a documentação mora no mesmo repositório)
- **Infra / VPS** (opcional): — (não roda em lugar nenhum; é um kit de arquivos)
- **Notas** (opcional): extraído do COMINT em 21/09/2026. O `kit/` é a fonte única — o `template/`
  não carrega cópia dos componentes, quem junta os dois é o `instalar.sh`.

## Projetos conectados

### COMINT — origem do sistema visual

- **Pasta local do projeto** (obrigatório): `/home/victor/Documentos/DEV/COMINT`
- **Repositório do projeto** (obrigatório): https://github.com/Clinio-Hub/comint
- **Documentação local** (obrigatório): `/home/victor/Documentos/DEV/Obsidians/Obsidian-COMINT`
- **Repositório da documentação** (opcional): https://github.com/Clinio-Hub/Obsidian-comint
- **Infra / VPS** (opcional): Supabase `igunplrnyhyszuxurvkd`
- **Notas** (opcional): é de onde o sistema veio (ADR-004, PR #5 e os PRs de coluna e tema escuro).
  A relação é de **cópia num instante**, não de dependência: o COMINT não importa nada deste
  repositório, e uma correção feita aqui só chega lá se alguém a levar à mão.
