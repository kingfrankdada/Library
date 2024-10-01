-- 如果需要删除现有的外键约束，请先执行下面的语句
-- ALTER TABLE book DROP FOREIGN KEY fk_book_menu;

-- 确保 menu 表的 title 列为唯一约束
-- ALTER TABLE menu ADD CONSTRAINT UNIQUE (title);

-- -- 修改 book 表的 menu 列，使其可以与 menu 表的 title 列进行外键关联
-- ALTER TABLE book MODIFY COLUMN menu VARCHAR(255);

-- 添加外键约束，将 book 表的 menu 列与 menu 表的 title 列关联
ALTER TABLE book
ADD CONSTRAINT fk_book_menu
FOREIGN KEY (menu) REFERENCES menu(title)
ON DELETE SET NULL ON UPDATE CASCADE;
