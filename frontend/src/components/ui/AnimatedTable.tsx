import { Table, TableProps } from "antd";
import { motion } from "framer-motion";

export default function AnimatedTable<RecordType extends object>(
  props: TableProps<RecordType>
) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Table {...props} />
    </motion.div>
  );
}