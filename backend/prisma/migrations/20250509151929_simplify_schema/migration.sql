/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `calorias` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `destaque` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `ePicante` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `horaDePreparacao` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `maisVendidos` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `naoContemGluten` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `promocionalPreco` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `vegetariano` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `AdicionalItemPedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemPedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpcaoItemPedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UsuarioFavoritos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdicionalItemPedido" DROP CONSTRAINT "AdicionalItemPedido_adicionalProdutoId_fkey";

-- DropForeignKey
ALTER TABLE "AdicionalItemPedido" DROP CONSTRAINT "AdicionalItemPedido_itemPedidoId_fkey";

-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ItemPedido" DROP CONSTRAINT "ItemPedido_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "ItemPedido" DROP CONSTRAINT "ItemPedido_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "OpcaoItemPedido" DROP CONSTRAINT "OpcaoItemPedido_itemPedidoId_fkey";

-- DropForeignKey
ALTER TABLE "OpcaoItemPedido" DROP CONSTRAINT "OpcaoItemPedido_opcaoProdutoId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioFavoritos" DROP CONSTRAINT "_UsuarioFavoritos_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsuarioFavoritos" DROP CONSTRAINT "_UsuarioFavoritos_B_fkey";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "atualizadoEm",
DROP COLUMN "calorias",
DROP COLUMN "criadoEm",
DROP COLUMN "destaque",
DROP COLUMN "ePicante",
DROP COLUMN "horaDePreparacao",
DROP COLUMN "maisVendidos",
DROP COLUMN "naoContemGluten",
DROP COLUMN "promocionalPreco",
DROP COLUMN "vegetariano";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "atualizadoEm",
DROP COLUMN "isAdmin",
DROP COLUMN "role",
ADD COLUMN     "endereco" TEXT;

-- DropTable
DROP TABLE "AdicionalItemPedido";

-- DropTable
DROP TABLE "Endereco";

-- DropTable
DROP TABLE "ItemPedido";

-- DropTable
DROP TABLE "OpcaoItemPedido";

-- DropTable
DROP TABLE "Pedido";

-- DropTable
DROP TABLE "_UsuarioFavoritos";
